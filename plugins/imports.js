import FastGlob from 'fast-glob'
import { dirname, normalize, relative, resolve, extname } from 'path'
import fs from 'fs'

const imports = (options = {}, config) => {
    const filenamePattern = options.filenamePattern
    const ignoredPaths = Object.keys(filenamePattern).map(filepath => `!**/${filenamePattern[filepath]}`)
    const getPaths = FastGlob.sync(options.paths, { onlyFiles: false, ignore: ignoredPaths }).map(entry => resolve(process.cwd(), entry))
    const paths = getPaths.filter(path => relative(config.root, dirname(path)).includes('/'))
    const dirPaths = {}

    paths.forEach((path) => {
        if (!dirPaths[dirname(path)]) {
            dirPaths[dirname(path)] = [path]
        } else {
            dirPaths[dirname(path)].push(path)
        }
    })

    Object.keys(dirPaths).forEach(dir => {
        Object.keys(filenamePattern).forEach(filepath => {
            const filename = filenamePattern[filepath]

            if (dirPaths[dir].filter(path => path.includes(filepath)).length > 0) {
                let imports = ''
                const savePath = `${dir}/${filename}`

                if (options.extnamePattern.styles.test(filename)) {
                    dirPaths[dir].forEach(path => {
                        const relativePath = relative(dirname(path), path)

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

const vitePluginImports = () => {
    return {
        name: '@vituum/vite-plugin-imports',
        apply: 'serve',
        configResolved(config) {
            imports(config.vituum.imports, config)
        },
        handleHotUpdate({ file, server }) {
            const filenamePattern = server.config.vituum.imports.filenamePattern

            server.config.vituum.imports.paths.forEach(path => {
                const importsPath = relative(server.config.root, dirname(normalize(path)))
                const filePath = relative(server.config.root, dirname(file))

                if (filePath.startsWith(importsPath) && Object.keys(filenamePattern).filter(filename => file.endsWith(filename)).length === 0) {
                    imports(Object.assign(server.config.vituum.imports, {
                        paths: [`${dirname(file)}/**`]
                    }), server.config)
                }
            })
        }
    }
}

export default vitePluginImports
