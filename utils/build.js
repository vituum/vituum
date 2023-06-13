import { rename } from 'node:fs/promises'
import { relative, resolve } from 'path'
import FastGlob from 'fast-glob'

export const resolveInputPaths = (paths, formats) => FastGlob.sync([...paths]).map(entry => {
    if (formats.find(format => entry.endsWith(format.toString()))) {
        entry = `${entry}.html`
    }

    return resolve(process.cwd(), entry)
})

export const renameBuildStart = async (files, formats) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            await rename(file.replace('.html', ''), file)
        }
    }
}

export const renameBuildEnd = async (files, formats) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            await rename(file, file.replace('.html', ''))
        }
    }
}

export const renameGenerateBundle = async (files, formats, bundle, relativePath) => {
    for (const file of files) {
        const format = formats.find(format => file.endsWith(format.replace(format, `${format}.html`)))

        if (format) {
            const path = relative(process.cwd(), file)
            const replaceExt = path.endsWith(`.json.${format}.html`) ? `.${format}.html` : `.${format}`

            if (bundle[path] && formats.find(format => bundle[path].fileName.endsWith(format.replace(format, `${format}.html`)))) {
                bundle[path].fileName = relative(relativePath, path).replace(replaceExt, '')
            }
        }
    }
}
