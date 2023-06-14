import { rename } from 'node:fs/promises'
import { relative, resolve } from 'path'
import FastGlob from 'fast-glob'

/**
 * @param {string[]} paths
 * @param {string[]} formats
 * @returns {string[]}
 */
export const resolveInputPaths = (paths, formats) => FastGlob.sync([...paths]).map(entry => {
    if (formats.find(format => entry.endsWith(format.toString()))) {
        entry = `${entry}.html`
    }

    return resolve(process.cwd(), entry)
})

/**
 * @param {string[]} files
 * @param {string[]} formats
 * @returns void
 */
export const renameBuildStart = async (files, formats) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            await rename(file.replace('.html', ''), file)
        }
    }
}

/**
 * @param {string[]} files
 * @param {string[]} formats
 * @returns void
 */
export const renameBuildEnd = async (files, formats) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            await rename(file, file.replace('.html', ''))
        }
    }
}

/**
 * @param {string[]} files
 * @param {string[]} formats
 * @param {import('rollup').FunctionPluginHooks.generateBundle} bundle
 * @param {import('./build.d.ts').transformPath} [transformPath]
 * @returns {Promise<void>}
 */
export const renameGenerateBundle = async (files, formats, bundle, transformPath) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            const path = relative(process.cwd(), file)
            const replaceExt = path.endsWith(`.json.${format}.html`) ? `.${format}.html` : `.${format}`

            if (bundle[path] && formats.find(format => bundle[path].fileName.endsWith(format.replace(format, `${format}.html`)))) {
                if (transformPath) {
                    bundle[path].fileName = transformPath(bundle[path].fileName).replace(replaceExt, '')
                } else {
                    bundle[path].fileName = bundle[path].fileName.replace(replaceExt, '')
                }
            }
        }
    }
}
