import fs from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { merge } from '../utils/common.js'

/**
 * @type {import('vituum/types/plugins/pages.d.ts').UserConfig}
 */
export const defaultConfig = {
    root: './src',
    dir: './src/pages',
    formats: ['json', 'latte', 'twig', 'liquid', 'njk', 'hbs', 'pug'],
    ignoredPaths: []
}

/**
 * @param {import('vituum/types/plugins/pages.d.ts').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginUserConfig = {}) => {
    pluginUserConfig = merge(defaultConfig, pluginUserConfig)

    return {
        name: '@vituum/vite-plugin-pages',
        apply: 'serve',
        configureServer (viteDevServer) {
            const viewsPath = relative(viteDevServer.config.root, resolve(viteDevServer.config.root, pluginUserConfig.dir))
            const viewsIgnoredPaths = pluginUserConfig.ignoredPaths
            const formats = pluginUserConfig.formats

            return () => {
                viteDevServer.middlewares.use(async (req, res, next) => {
                    let transformedUrl = req.originalUrl.replace('.html', '')

                    if (req.originalUrl === '/' || req.originalUrl.endsWith('/')) {
                        transformedUrl = transformedUrl + 'index'
                    }

                    if (!req.originalUrl.startsWith('/' + viewsPath) && viewsIgnoredPaths.filter(path => req.originalUrl.startsWith(`/${path}`)).length === 0) {
                        transformedUrl = '/' + viewsPath + transformedUrl
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

                    if (format || req.originalUrl.endsWith('.json')) {
                        let output = await viteDevServer.transformIndexHtml(
                            transformedUrl,
                            fs.readFileSync(join(viteDevServer.config.root, transformedUrl.replace('.html', ''))).toString()
                        )

                        if (req.originalUrl.endsWith('.json')) {
                            res.setHeader('Content-Type', 'application/json')

                            // noinspection HtmlUnknownTarget
                            output = output.replace('<script type="module" src="/@vite/client"></script>', '')
                        } else {
                            res.setHeader('Content-Type', 'text/html')
                        }

                        res.statusCode = 200
                        res.end(output)
                    } else {
                        req.url = transformedUrl

                        next()
                    }
                })
            }
        }
    }
}

export default plugin
