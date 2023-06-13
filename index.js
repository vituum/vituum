import pluginPages from './plugins/pages.js'
import { resolveInputPaths, renameGenerateBundle } from './utils/build.js'

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
            pluginUserConfig.pages.dir[0]
        )
    }
})

const plugin = (pluginUserConfig) => {
    return [pluginCore(pluginUserConfig), pluginPages(pluginUserConfig)]
}

export default plugin
