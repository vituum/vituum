import FastGlob from 'fast-glob'
import { dirname, normalize, relative, resolve, extname } from 'node:path'
import { merge } from '../utils/common.js'
import fs from 'node:fs'
import chokidar from 'chokidar'

/**
 * @type {import('vituum/types/plugins/imports.d.ts').UserConfig}
 */
export const defaultConfig = {
    filenamePattern: {
        '+.css': 'src/styles',
        '+.js': 'src/scripts'
    },
    extnamePattern: {
        styles: /.(css|less|scss|pcss)$/,
        scripts: /.(js|mjs|ts)$/
    },
    paths: ['./src/styles/**', './src/scripts/**']
}

/**
 * @param {import('vituum/types/plugins/imports.d.ts').UserConfig} options
 * @param {import('vite').ResolvedConfig} config
 */
const imports = (options, config) => {
    const filenamePattern = options.filenamePattern
    const ignoredPaths = Object.keys(filenamePattern).map(filename => `!**/${filename}`)
    const getPaths = FastGlob.sync(options.paths.map(path => path.replace(/\\/g, '/')), { onlyFiles: false, ignore: ignoredPaths }).map(entry => resolve(process.cwd(), entry))
    const paths = getPaths.filter(path => relative(config.root, dirname(path)).replace(/\\/g, '/').includes('/'))
    const dirPaths = {}

    paths.forEach((path) => {
        if (!dirPaths[dirname(path)]) {
            dirPaths[dirname(path)] = [path]
        } else {
            dirPaths[dirname(path)].push(path)
        }
    })

    Object.keys(dirPaths).forEach(dir => {
        Object.keys(filenamePattern).forEach(filename => {
            const pattern = dirPaths[dir].filter(path => {
                if (Array.isArray(filenamePattern[filename])) {
                    // @ts-ignore
                    return filenamePattern[filename].some(string => path.replace(/\\/g, '/').includes(string.replace(/\\/g, '/')))
                } else {
                    // @ts-ignore
                    return path.replace(/\\/g, '/').includes(filenamePattern[filename].replace(/\\/g, '/'))
                }
            })

            if (filename && pattern.length > 0) {
                let imports = ''
                const savePath = `${dir}/${filename}`

                if (options.extnamePattern.styles.test(filename)) {
                    dirPaths[dir].forEach(path => {
                        const relativePath = relative(dirname(path), path)

                        if ((!options.extnamePattern.styles.test(path) && !fs.statSync(path).isDirectory()) || (fs.statSync(path).isDirectory() && !fs.existsSync(resolve(path, filename)))) {
                            return
                        }

                        if (fs.statSync(path).isFile()) {
                            imports = imports + `@import "${relativePath}";\r\n`
                        } else {
                            imports = imports + `@import "${relativePath}/${filename}";\r\n`
                        }
                    })
                }

                if (options.extnamePattern.scripts.test(filename)) {
                    dirPaths[dir].forEach(path => {
                        const relativePath = relative(dirname(path), path)

                        if ((!options.extnamePattern.scripts.test(path) && !fs.statSync(path).isDirectory()) || (fs.statSync(path).isDirectory() && !fs.existsSync(resolve(path, filename)))) {
                            return
                        }

                        if (fs.statSync(path).isFile()) {
                            if (fs.readFileSync(path).toString().includes('export default')) {
                                imports = imports + `export { default as ${relativePath.replace(extname(relativePath), '')} } from './${relativePath}'\r\n`
                            } else {
                                imports = imports + `import './${relativePath}'\r\n`
                            }
                        } else {
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
 * @param {import('vituum/types/plugins/imports.d.ts').UserConfig} pluginUserConfig
 * @param {import('vite').ResolvedConfig} config
 */
const fileChanged = (file, pluginUserConfig, config) => {
    const filenamePattern = pluginUserConfig.filenamePattern

    pluginUserConfig.paths.forEach(path => {
        const importsPath = relative(config.root, dirname(normalize(path)))
        const filePath = relative(config.root, dirname(file))

        if (filePath.startsWith(importsPath) && Object.keys(filenamePattern).filter(filename => file.endsWith(filename)).length === 0) {
            imports(Object.assign({
                paths: [`${dirname(file)}/**`]
            }, pluginUserConfig), config)
        }
    })
}

/**
 * @param {import('vituum/types/plugins/imports.d.ts').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginUserConfig = {}) => {
    pluginUserConfig = merge(defaultConfig, pluginUserConfig)

    return {
        name: '@vituum/vite-plugin-imports',
        apply: 'serve',
        configResolved (config) {
            imports(pluginUserConfig, config)

            const watcher = chokidar.watch(pluginUserConfig.paths, {
                ignored: /(^|[/\\])\../,
                persistent: true
            })

            watcher.on('add', file => fileChanged(file, pluginUserConfig, config)).on('unlink', file => fileChanged(file, pluginUserConfig, config))
        }
    }
}

export default plugin
