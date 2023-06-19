import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import lodash from 'lodash'
import FastGlob from 'fast-glob'
import process from 'node:process'
import { renameGenerateBundle } from './build.js'

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
 * @returns {import('vite').Plugin}
 */
export const pluginBundle = (formats) => {
    let resolvedConfig

    return {
        name: '@vituum/vite-plugin-core:bundle',
        enforce: 'post',
        configResolved (config) {
            resolvedConfig = config
        },
        generateBundle: async (_, bundle) => {
            await renameGenerateBundle(
                {
                    files: resolvedConfig.build.rollupOptions.input,
                    formats,
                    root: resolvedConfig.root
                },
                bundle
            )
        }
    }
}

/**
 * @type {typeof import("vituum/types/utils/common").processData}
 */
export const processData = ({ paths, root = process.cwd() }, data = {}) => {
    let context = {}

    lodash.merge(context, data)

    const normalizePaths = Array.isArray(paths) ? paths.map(path => path.replace(/\\/g, '/')) : paths.replace(/\\/g, '/')

    FastGlob.sync(normalizePaths).forEach(entry => {
        const path = resolve(root, entry)

        context = lodash.merge(context, JSON.parse(fs.readFileSync(path).toString()))
    })

    return context
}
