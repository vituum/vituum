import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import lodash from 'lodash'
import FastGlob from 'fast-glob'
import process from 'node:process'
import { renameGenerateBundle } from './build.js'

/**
 * @type {typeof import("./common").getPackageInfo}
 */
export const getPackageInfo = (path) => JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(path))), 'package.json')).toString())

/**
 * @type {typeof import("./common").pluginError}
 */
export const pluginError = (error, server, name) => {
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
 * @type {typeof import("./common").pluginReload}
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
                resolvedConfig.build.rollupOptions.input,
                formats,
                bundle
            )
        }
    }
}

/**
 * @type {typeof import("./common").processData}
 */
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
