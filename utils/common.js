import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import process from 'node:process'

export const getPackageInfo = (path) => JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(path))), 'package.json')).toString())

export const pluginError = (error, server) => {
    if (error) {
        if (!server) {
            return new Promise((resolve, reject) => {
                reject(new Error(error.message ?? error))
            })
        }

        setTimeout(() => server.ws.send({
            type: 'error',
            err: {
                message: error.message ?? error,
                plugin: name
            }
        }), 50)

        return true
    } else {
        return false
    }
}

export const pluginReload = ({ file, server }, { reload, formats }) => {
    if (
        (typeof reload === 'function' && reload(file)) ||
        (typeof reload === 'boolean' && reload && formats.find(format => file.endsWith(`${format}.html`)))
    ) {
        server.ws.send({ type: 'full-reload' })
    }
}

export const pluginBundle = (formats) => {
    let resolvedConfig

    return {
        enforce: 'post',
        configResolved (config) {
            resolvedConfig = config
        },
        generateBundle: async (_, bundle) => {
            await renameGenerateBundle(
                resolvedConfig.build.rollupOptions.input,
                formats,
                bundle
            )
        }
    }
}

export const processData = (paths, data = {}) => {
    let context = {}

    lodash.merge(context, data)

    const normalizePaths = Array.isArray(paths) ? paths.map(path => path.replace(/\\/g, '/')) : paths.replace(/\\/g, '/')

    FastGlob.sync(normalizePaths).forEach(entry => {
        const path = resolve(process.cwd(), entry)

        context = lodash.merge(context, JSON.parse(fs.readFileSync(path).toString()))
    })

    return context
}
