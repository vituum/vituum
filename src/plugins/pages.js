import fs from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { merge } from '../utils/common.js'

/**
 * @type {import('vituum/types/plugins/pages').UserConfig}
 */
export const defaultConfig = {
    root: './src',
    dir: './src/pages',
    formats: ['json', 'latte', 'twig', 'liquid', 'njk', 'hbs', 'pug'],
    ignoredPaths: []
}

/**
 * @param {import('vituum/types/plugins/pages').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginUserConfig = {}) => {
    pluginUserConfig = merge(defaultConfig, pluginUserConfig)

    return {
        name: '@vituum/vite-plugin-pages',
        apply: 'serve',
        configureServer (viteDevServer) {
            const pagesRoot = relative(viteDevServer.config.root, pluginUserConfig.root)
            const pagesPath = relative(viteDevServer.config.root, resolve(viteDevServer.config.root, pluginUserConfig.dir))
            const pagesIgnoredPath = pluginUserConfig.ignoredPaths
            const formats = pluginUserConfig.formats

            return () => {
                viteDevServer.middlewares.use(async (req, res, next) => {
                    const url = new URL(req.originalUrl, 'http://localhost')
                    const originalUrl = url.pathname
                    let transformedUrl = originalUrl.replace('.html', '')

                    if (originalUrl === '/' || originalUrl.endsWith('/')) {
                        transformedUrl = transformedUrl + 'index'
                    }

                    if (!originalUrl.startsWith('/' + pagesPath) && !pagesIgnoredPath.find(path => originalUrl.startsWith(`/${path}`))) {
                        transformedUrl = '/' + pagesPath + transformedUrl
                    } else if (!originalUrl.startsWith('/' + pagesRoot)) {
                        transformedUrl = '/' + pagesRoot + transformedUrl
                    }

                    const format = formats.find(format => {
                        if (fs.existsSync(join(viteDevServer.config.root, `${transformedUrl}.${format}`))) {
                            return format
                        } else {
                            return null
                        }
                    })

                    if (format) {
                        transformedUrl = transformedUrl + `.${format}.html`
                    } else {
                        transformedUrl = transformedUrl + '.html'
                    }

                    if (format || originalUrl.endsWith('.json')) {
                        let output = await viteDevServer.transformIndexHtml(
                            transformedUrl,
                            fs.readFileSync(join(viteDevServer.config.root, transformedUrl.replace('.html', ''))).toString()
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
                    } else if (fs.existsSync(join(viteDevServer.config.root, transformedUrl))) {
                        req.url = transformedUrl

                        next()
                    } else {
                        next()
                    }
                })
            }
        }
    }
}

export default plugin
