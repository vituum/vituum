/**
 * @param {PropertyKey} key - The property key to check
 * @returns `true` if the property is unsafe to modify directly, `false` otherwise
 * @internal
 */
function isUnsafeProperty(key) {
  return key === '__proto__'
}

/**
 * Checks if a given value is a plain object.
 *
 * @param {object} value - The value to check.
 * @returns {value is Record<PropertyKey, any>} - True if the value is a plain object, otherwise false.
 */
function isPlainObject(value) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const proto = Object.getPrototypeOf(value)

  const hasObjectPrototype
    = proto === null
      || proto === Object.prototype
    // Required to support node:vm.runInNewContext({})
      || Object.getPrototypeOf(proto) === null

  if (!hasObjectPrototype) {
    return false
  }

  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * @param {T} target - The target object into which the source object properties will be merged. This object is modified in place.
 * @param {S} source - The source object whose properties will be merged into the target object.
 * @returns {T & S} The updated target object with properties from the source object merged in.
 *
 * @template T
 * @template S
 */
export function merge(
  target,
  source,
) {
  const sourceKeys = Object.keys(source)

  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i]

    if (isUnsafeProperty(key)) {
      continue
    }

    const sourceValue = source[key]
    const targetValue = target[key]

    if (isMergeableValue(sourceValue) && isMergeableValue(targetValue)) {
      target[key] = merge(targetValue, sourceValue)
    }
    else if (Array.isArray(sourceValue)) {
      target[key] = merge([], sourceValue)
    }
    else if (isPlainObject(sourceValue)) {
      target[key] = merge({}, sourceValue)
    }
    else if (targetValue === undefined || sourceValue !== undefined) {
      target[key] = sourceValue
    }
  }

  // @ts-ignore
  return target
}

/**
 * @param {unknown} value
 */
function isMergeableValue(value) {
  return isPlainObject(value) || Array.isArray(value)
}

/**
 * @param {T} target - The target object into which the source object properties will be merged. This object is modified in place.
 * @param {S} source - The source object whose properties will be merged into the target object.
 * @param {(targetValue: any, sourceValue: any, key: string, target: T, source: S) => any} merge - A custom merge function that defines how properties should be combined. It receives the following arguments:
 *   - `targetValue`: The current value of the property in the target object.
 *   - `sourceValue`: The value of the property in the source object.
 *   - `key`: The key of the property being merged.
 *   - `target`: The target object.
 *   - `source`: The source object.
 *
 * @returns {T & S} The updated target object with properties from the source object merged in.
 *
 * @template T - Type of the target object.
 * @template S - Type of the source object.
 */
export function mergeWith(
  target,
  source,
  merge,
) {
  const sourceKeys = Object.keys(source)

  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i]

    if (isUnsafeProperty(key)) {
      continue
    }

    const sourceValue = source[key]
    const targetValue = target[key]

    const merged = merge(targetValue, sourceValue, key, target, source)

    if (merged !== undefined) {
      target[key] = merged
    }
    else if (Array.isArray(sourceValue)) {
      if (Array.isArray(targetValue)) {
        target[key] = mergeWith(targetValue, sourceValue, merge)
      }
      else {
        // @ts-ignore
        target[key] = mergeWith([], sourceValue, merge)
      }
    }
    else if (isPlainObject(sourceValue)) {
      if (isPlainObject(targetValue)) {
        target[key] = mergeWith(targetValue, sourceValue, merge)
      }
      else {
        target[key] = mergeWith({}, sourceValue, merge)
      }
    }
    else if (targetValue === undefined || sourceValue !== undefined) {
      target[key] = sourceValue
    }
  }

  // @ts-ignore
  return target
}
