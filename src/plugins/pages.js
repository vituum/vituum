import { resolve, relative } from 'node:path'
import { merge } from '../utils/common.js'
import { normalizePath } from 'vite'

/**
 * @type {import('vituum/types/plugins/pages').UserConfig}
 */
export const defaultConfig = {
    root: './src',
    dir: './src/pages',
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
            const pagesRoot = relative(viteDevServer.config.root, normalizePath(pluginUserConfig.root))
            const pagesPath = relative(viteDevServer.config.root, resolve(viteDevServer.config.root, normalizePath(pluginUserConfig.dir)))
            const pagesIgnoredPath = pluginUserConfig.ignoredPaths

            return () => {
                viteDevServer.middlewares.use(async (req, res, next) => {
                    const url = new URL(req.originalUrl, 'http://localhost')

                    if (url.pathname.endsWith('/')) {
                        url.pathname = url.pathname + 'index.html' + url.search
                    }

                    if (!url.pathname.startsWith('/' + pagesPath) && !pagesIgnoredPath.find(path => url.pathname.startsWith(`/${path}`))) {
                        req.url = '/' + pagesPath + url.pathname + url.search
                    } else if (!url.pathname.startsWith('/' + pagesRoot)) {
                        req.url = '/' + pagesRoot + url.pathname + url.search
                    }

                    req.originalUrl = req.url

                    next()
                })
            }
        }
    }
}

export default plugin
