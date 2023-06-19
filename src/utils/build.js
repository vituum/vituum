import { rename } from 'node:fs/promises'
import { relative, resolve } from 'path'
import FastGlob from 'fast-glob'

/**
 * @param {import('vituum/types/utils/build').resolveInputPathsOptions} options
 * @param {string[]} formats
 * @returns {string[]}
 */
export const resolveInputPaths = ({ paths, root = process.cwd() }, formats) => {
    return FastGlob.sync(
        Array.isArray(paths) ? [...paths] : (typeof paths === 'string' ? paths : null)
    ).map(entry => {
        if (formats.find(format => entry.endsWith(format.toString()))) {
            entry = `${entry}.html`
        }

        return resolve(root, entry)
    })
}

/**
 * @param {string[]} files
 * @param {string[]} formats
 * @returns void
 */
export const renameBuildStart = async (files, formats) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))
        const initialFile = file.replace('.html', '')

        if (format) {
            await rename(initialFile, file).catch(() => {})
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
        const initialFile = file.replace('.html', '')

        if (format) {
            await rename(file, initialFile).catch(() => {})
        }
    }
}

/**
 * @param {import('vituum/types/utils/build').renameGenerateBundleOptions} options
 * @param {import('rollup').OutputBundle} bundle
 * @param {import('vituum/types/utils/build').transformPath} [transformPath]
 * @returns {Promise<void>}
 */
export const renameGenerateBundle = async ({ files, formats, root }, bundle, transformPath) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            const path = relative(root, file)
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
