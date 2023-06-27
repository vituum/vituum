import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import lodash from 'lodash'
import FastGlob from 'fast-glob'
import process from 'node:process'
import { renameGenerateBundle } from './build.js'
import { join } from 'node:path'
import { minimatch } from 'minimatch'
import { normalizePath } from 'vite'

export const merge = (object, sources) => lodash.mergeWith(object, sources, (a, b) => lodash.isArray(b) ? b : undefined)

/**
 * @type {typeof import("vituum/types/utils/common").getPackageInfo}
 */
export const getPackageInfo = (path) => JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(path))), 'package.json')).toString())

/**
 * @type {typeof import("vituum/types/utils/common").pluginError}
 */
export const pluginError = (error, server, name) => {
    if (error) {
        if (!server) {
            return new Promise((resolve, reject) => {
                reject(new Error(typeof error === 'string' ? error : error.message))
            })
        }

        setTimeout(() => server.ws.send({
            type: 'error',
            err: {
                message: typeof error === 'string' ? error : error.message,
                plugin: name,
                stack: null
            }
        }), 50)

        return true
    } else {
        return false
    }
}

/**
 * @type {typeof import("vituum/types/utils/common").pluginReload}
 */
export const pluginReload = ({ file, server }, { reload, formats }) => {
    if (
        (typeof reload === 'function' && reload(file)) ||
        (typeof reload === 'boolean' && reload && formats.find(format => file.endsWith(`${format}`)))
    ) {
        server.ws.send({ type: 'full-reload' })
    }
}

/**
 * @param {string[]} formats
 * @param {string} name
 * @returns {import('vite').Plugin}
 */
export const pluginBundle = (formats, name = '@vituum/vite-plugin-core') => {
    let resolvedConfig

    return {
        name: name + ':bundle',
        enforce: 'post',
        configResolved (config) {
            resolvedConfig = config
        },
        generateBundle: async (_, bundle) => {
            await renameGenerateBundle(
                bundle,
                {
                    files: [...resolvedConfig.build.rollupOptions.input],
                    root: resolvedConfig.root,
                    formats
                }
            )
        }
    }
}

/**
 * @param {string} name
 * @param {string[]} formats
 * @returns {import('vite').Plugin}
 */
export const pluginMiddleware = (name = '@vituum/vite-plugin-core', formats = []) => {
    return {
        name: name + ':middleware',
        apply: 'serve',
        configureServer (viteDevServer) {
            return () => {
                viteDevServer.middlewares.use(async (req, res, next) => {
                    const url = new URL(req.originalUrl, 'http://localhost')
                    const originalUrl = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname
                    const originalFilename = originalUrl.replace('.html', '')

                    const format = formats.find(format => {
                        if (fs.existsSync(join(viteDevServer.config.root, `${originalFilename}.${format}`))) {
                            return format
                        } else {
                            return null
                        }
                    })

                    if (format) {
                        let output = await viteDevServer.transformIndexHtml(
                            originalFilename + `.${format}.html`,
                            fs.readFileSync(join(viteDevServer.config.root, originalFilename + `.${format}`)).toString()
                        )

                        if (originalUrl.endsWith('.json')) {
                            res.setHeader('Content-Type', 'application/json')

                            // noinspection HtmlUnknownTarget
                            output = output.replace('<script type="module" src="/@vite/client"></script>', '')
                        } else {
                            res.setHeader('Content-Type', 'text/html')
                        }

                        res.statusCode = 200
                        res.end(output)
                    } else {
                        next()
                    }
                })
            }
        }
    }
}

/**
 * @type {typeof import("vituum/types/utils/common").processData}
 */
export const processData = ({ paths, root = process.cwd() }, data = {}) => {
    let context = {}

    lodash.merge(context, data)

    const normalizePaths = Array.isArray(paths) ? paths.map(path => normalizePath(path)) : normalizePath(paths)

    FastGlob.sync(normalizePaths).forEach(entry => {
        const path = resolve(root, entry)

        context = lodash.merge(context, JSON.parse(fs.readFileSync(path).toString()))
    })

    return context
}

/**
 * @type {typeof import("vituum/types/utils/common").pluginTransform}
 */
export const pluginTransform = async (content, { path, filename, server }, { name, options, resolvedConfig, renderTemplate }) => {
    if (
        !options.formats.find(format => filename.replace('.html', '').endsWith(format)) ||
        (filename.replace('.html', '').endsWith('.json') && !content.startsWith('{'))
    ) {
        return content
    }

    if (
        (filename.replace('.html', '').endsWith('.json') && content.startsWith('{')) &&
        (JSON.parse(content)?.format && !options.formats.includes(JSON.parse(content)?.format))
    ) {
        return content
    }

    if (options.ignoredPaths.find(ignoredPath => minimatch(path.replace('.html', ''), ignoredPath) === true)) {
        return content
    }

    const render = await renderTemplate({ filename, server, resolvedConfig }, content, options)
    const renderError = pluginError(render.error, server, name)

    if (renderError && server) {
        return
    } else if (renderError) {
        return renderError
    }

    return render.content
}

export { normalizePath }
