import { supportedFormats } from '../utils/common.js'
import fs from 'fs'
import { join, resolve, relative } from 'path'

const vitePluginMiddleware = {
    name: '@vituum/vite-plugin-middleware',
    apply: 'serve',
    configureServer(viteDevServer) {
        const viewsDir = resolve(viteDevServer.config.root, viteDevServer.config.vituum.middleware.viewsDir)
        const viewsUrl = relative(viteDevServer.config.root, viewsDir)
        const viewsIgnoredPaths = viteDevServer.config.vituum.middleware.viewsIgnoredPaths
        const contentTypeJsonPaths = viteDevServer.config.vituum.middleware.contentTypeJsonPaths

        return () => {
            viteDevServer.middlewares.use(async(req, res, next) => {
                let format = null
                let transformedUrl = req.originalUrl.replace('.html', '')

                if (req.originalUrl === '/' || req.originalUrl.endsWith('/')) {
                    transformedUrl = transformedUrl + 'index'
                }

                if (!req.originalUrl.startsWith('/' + viewsUrl) && viewsIgnoredPaths.filter(path => req.originalUrl.startsWith(`/${path}`)).length === 0) {
                    transformedUrl = '/' + viewsUrl + transformedUrl
                }

                supportedFormats.every(supportedFormat => {
                    if (fs.existsSync(join(viteDevServer.config.root, `${transformedUrl}.${supportedFormat}`)) || fs.existsSync(join(viteDevServer.config.root, `${transformedUrl}.${supportedFormat}.html`))) {
                        format = supportedFormat
                        return false
                    } else {
                        return true
                    }
                })

                if (format) {
                    transformedUrl = transformedUrl + `.${format}.html`
                } else {
                    transformedUrl = transformedUrl + '.html'
                }

                const formatExists = fs.existsSync(join(viteDevServer.config.root, transformedUrl.replace('.html', '')))

                if ((formatExists && format) || contentTypeJsonPaths.filter(path => transformedUrl.startsWith(`/${path}`)).length !== 0) {
                    if (formatExists === false) {
                        transformedUrl = transformedUrl + '.html'
                    }

                    const output = await viteDevServer.transformIndexHtml(transformedUrl.replace('.html', ''), fs.readFileSync(join(viteDevServer.config.root, transformedUrl.replace('.html', ''))).toString())

                    if (contentTypeJsonPaths.filter(path => transformedUrl.startsWith(`/${path}`)).length !== 0) {
                        res.setHeader('Content-Type', 'application/json')
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

export default vitePluginMiddleware
