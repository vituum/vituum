import pluginPages from './plugins/pages.js'
import { resolveInputPaths, renameGenerateBundle } from './utils/build.js'
import { relative } from 'path'
import lodash from 'lodash'

const defaultConfig = {
    pages: {
        root: './src',
        dir: './src/pages',
        formats: ['json', 'latte', 'twig', 'liquid', 'njk', 'hbs', 'pug'],
        ignoredPaths: []
    }
}

let userConfig
let resolvedConfig

const pluginCore = (pluginUserConfig) => ({
    name: '@vituum/vite-plugin-core',
    enforce: 'post',
    config (config) {
        userConfig = config

        if (userConfig?.build?.rollupOptions?.input) {
            userConfig.build.rollupOptions.input = resolveInputPaths(userConfig.build.rollupOptions.input, pluginUserConfig.pages.formats)
        }
    },
    configResolved (config) {
        resolvedConfig = config
    },
    generateBundle: async (_, bundle) => {
        await renameGenerateBundle(
            resolvedConfig.build.rollupOptions.input,
            pluginUserConfig.pages.formats,
            bundle,
            file => {
                const pagesDir = relative(resolvedConfig.root, pluginUserConfig.pages.dir)
                const pagesRoot = pluginUserConfig.pages.root ? relative(resolvedConfig.root, pluginUserConfig.pages.root) : null

                if (file.includes(pagesDir)) {
                    return relative(pagesDir, file)
                } else if (pagesRoot && file.includes(pagesRoot)) {
                    return relative(pagesRoot, file)
                } else {
                    return file
                }
            }
        )
    }
})

const plugin = (pluginUserConfig) => {
    pluginUserConfig = lodash.merge(defaultConfig, pluginUserConfig)

    return [pluginCore(pluginUserConfig), pluginPages(pluginUserConfig.pages)]
}

export default plugin
