import { supportedFormats } from '../utils/common.js'
import fs from 'fs'
import { join } from 'path'

const vitePluginMiddleware = {
    name: '@vituum/vite-plugin-middleware',
    apply: 'serve',
    configureServer(viteDevServer) {
        return () => {
            viteDevServer.middlewares.use(async(req, res, next) => {
                let format = null
                let transformedUrl = req.originalUrl.replace('.html', '')

                if (req.originalUrl === '/' || req.originalUrl.endsWith('/')) {
                    transformedUrl = transformedUrl + 'index'
                }

                if (!req.originalUrl.startsWith('/views') && !req.originalUrl.startsWith('/emails')) {
                    transformedUrl = '/views' + transformedUrl
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

                if (fs.existsSync(join(viteDevServer.config.root, transformedUrl.replace('.html', ''))) && format) {
                    const output = await viteDevServer.transformIndexHtml(transformedUrl.replace('.html', ''), fs.readFileSync(join(viteDevServer.config.root, transformedUrl.replace('.html', ''))).toString())

                    if (transformedUrl.startsWith('/views/dialog')) {
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
