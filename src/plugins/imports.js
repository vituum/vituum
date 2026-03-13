import { dirname, normalize, relative, resolve, extname } from 'node:path'
import { deepMergeWith } from '../utils/common.js'
import fs from 'node:fs'
import chokidar from 'chokidar'
import { globSync } from 'tinyglobby'
import { normalizePath } from 'vite'
import picomatch from 'picomatch'

/**
 * @type {import('vituum/types/plugins/imports').UserConfig}
 */
export const defaultConfig = {
  filenamePattern: {
    '+.css': 'src/styles',
    '+.js': 'src/scripts',
  },
  extnamePattern: {
    styles: /.(css|less|scss|pcss)$/,
    scripts: /.(js|mjs|ts)$/,
  },
  paths: ['./src/styles/*/**', './src/scripts/*/**'],
}

/**
 * @param {import('vituum/types/plugins/imports').UserConfig} options
 * @param {import('vite').ResolvedConfig} config
 */
const imports = (options, config) => {
  const filenamePattern = options.filenamePattern
  const ignoredPaths = Object.keys(filenamePattern).map(filename => `!**/${filename}`)
  const pathsWithoutNegative = options.paths.filter(p => !p.startsWith('!'))
  const negativePaths = options.paths.filter(p => p.startsWith('!'))
  const exclude = ignoredPaths.filter(p => p.startsWith('!')).map(p => p.slice(1))
  const allPaths = globSync(pathsWithoutNegative.map(path => normalizePath(path)), {
    ignore: exclude,
    onlyFiles: false,
  }).map(entry => normalizePath(resolve(config.root, entry)))

  const paths = allPaths.filter((path) => {
    const relativePath = normalizePath(relative(config.root, path))

    return !negativePaths.some((negPattern) => {
      const pattern = normalizePath(negPattern.slice(1))
      const isMatch = picomatch(pattern, { dot: true })
      const isSubdirectoryMatch = picomatch(normalizePath(pattern + '/**'), { dot: true })

      return isMatch(relativePath) && !isSubdirectoryMatch(relativePath)
    })
  }).sort()

  const dirPaths = {}

  function isRoot(path) {
    return Object.keys(filenamePattern).find((filename) => {
      function checkPattern(patternPath) {
        return patternPath.split('/')
          .map((part, index) => index === 0 ? part : patternPath.split('/').slice(0, index + 1).join('/'))
          .find(filenamePatternPath => path.endsWith(filenamePatternPath))
      }

      if (
      // @ts-ignore
        (Array.isArray(filenamePattern[filename]) && filenamePattern[filename].find(filename => path.endsWith(checkPattern(filename))))
        || (!Array.isArray(filenamePattern[filename]) && path.endsWith(checkPattern(filenamePattern[filename])))
      ) {
        return filename
      }

      return null
    })
  }

  paths.forEach((path) => {
    if (!isRoot(dirname(path))) {
      if (!dirPaths[dirname(path)]) {
        dirPaths[dirname(path)] = [path]
      }
      else {
        dirPaths[dirname(path)].push(path)
      }
    }
  })

  Object.keys(dirPaths).forEach((dir) => {
    Object.keys(filenamePattern).forEach((filename) => {
      const pattern = dirPaths[dir].filter((path) => {
        if (Array.isArray(filenamePattern[filename])) {
          // @ts-ignore
          return filenamePattern[filename].some(string => path.includes(string))
        }
        else {
          // @ts-ignore
          return path.includes(filenamePattern[filename])
        }
      })

      if (filename && pattern.length > 0) {
        let imports = ''
        const savePath = `${dir}/${filename}`

        if (options.extnamePattern.styles.test(filename)) {
          dirPaths[dir].forEach((path) => {
            const relativePath = relative(dirname(path), path)

            if ((!options.extnamePattern.styles.test(path) && !fs.statSync(path).isDirectory()) || (fs.statSync(path).isDirectory() && !fs.existsSync(resolve(path, filename)))) {
              return
            }

            if (fs.statSync(path).isFile()) {
              imports = imports + `@import "./${relativePath}";\r\n`
            }
            else {
              imports = imports + `@import "./${relativePath}/${filename}";\r\n`
            }
          })
        }

        if (options.extnamePattern.scripts.test(filename)) {
          dirPaths[dir].forEach((path) => {
            const relativePath = relative(dirname(path), path)

            if ((!options.extnamePattern.scripts.test(path) && !fs.statSync(path).isDirectory()) || (fs.statSync(path).isDirectory() && !fs.existsSync(resolve(path, filename)))) {
              return
            }

            if (fs.statSync(path).isFile()) {
              if (fs.readFileSync(path).toString().includes('export default')) {
                imports = imports + `export { default as ${relativePath.replace(extname(relativePath), '')} } from './${relativePath}'\r\n`
              }
              else {
                imports = imports + `import './${relativePath}'\r\n`
              }
            }
            else {
              imports = imports + `import './${relativePath}/${filename}'\r\n`
            }
          })
        }

        if (imports !== '' && ((fs.existsSync(savePath) && fs.readFileSync(savePath).toString() !== imports) || !fs.existsSync(savePath))) {
          fs.writeFileSync(savePath, imports)
        }
      }
    })
  })
}

/**
 * @param {string} file
 * @param {import('vituum/types/plugins/imports').UserConfig} pluginUserConfig
 * @param {import('vite').ResolvedConfig} config
 */
const fileChanged = (file, pluginUserConfig, config) => {
  const filenamePattern = pluginUserConfig.filenamePattern

  pluginUserConfig.paths.forEach((path) => {
    const importsPath = relative(config.root, dirname(normalize(path.replace('/*', ''))))
    const filePath = relative(config.root, dirname(file))

    if (filePath.startsWith(importsPath) && Object.keys(filenamePattern).filter(filename => file.endsWith(filename)).length === 0) {
      imports(Object.assign({
        paths: [`${dirname(file)}/**`],
      }, pluginUserConfig), config)
    }
  })
}

/**
 * @param {import('vituum/types/plugins/imports').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginUserConfig = {}) => {
  pluginUserConfig = deepMergeWith(defaultConfig, pluginUserConfig)

  return {
    name: '@vituum/vite-plugin-imports',
    apply: 'serve',
    configResolved(config) {
      imports(pluginUserConfig, config)

      const watcher = chokidar.watch(globSync(pluginUserConfig.paths, {
        onlyFiles: false,
      }), {
        ignored: /(^|[/\\])\../,
        persistent: true,
      })

      watcher.on('add', file => fileChanged(file, pluginUserConfig, config)).on('unlink', file => fileChanged(file, pluginUserConfig, config))
    },
  }
}

export default plugin
