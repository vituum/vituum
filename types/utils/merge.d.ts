/**
 * Merges properties from a source object into a target object recursively.
 * Arrays and plain objects are deeply merged.
 *
 * @template T - Type of the target object.
 * @template S - Type of the source object.
 * @param target - The target object into which the source object properties will be merged. This object is modified in place.
 * @param source - The source object whose properties will be merged into the target object.
 * @returns The updated target object with properties from the source object merged in.
 */
export function merge<T extends Record<PropertyKey, any>, S extends Record<PropertyKey, any>>(
    target: T,
    source: S
): T & S;

/**
 * Merges properties from a source object into a target object using a custom merge function.
 *
 * @template T - Type of the target object.
 * @template S - Type of the source object.
 * @param target - The target object into which the source object properties will be merged. This object is modified in place.
 * @param source - The source object whose properties will be merged into the target object.
 * @param merge - A custom merge function that defines how properties should be combined. It receives the following arguments:
 *   - `targetValue`: The current value of the property in the target object.
 *   - `sourceValue`: The value of the property in the source object.
 *   - `key`: The key of the property being merged.
 *   - `target`: The target object.
 *   - `source`: The source object.
 * @returns The updated target object with properties from the source object merged in.
 */
export function mergeWith<T extends Record<PropertyKey, any>, S extends Record<PropertyKey, any>>(
    target: T,
    source: S,
    merge: (targetValue: any, sourceValue: any, key: string, target: T, source: S) => any
): T & S;
