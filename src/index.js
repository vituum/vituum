import pluginPages, { defaultConfig as defaultConfigPages } from './plugins/pages.js'
import pluginImports, { defaultConfig as defaultConfigImports } from './plugins/imports.js'
import { resolveInputPaths } from './utils/build.js'
import { merge } from './utils/common.js'

const defaultConfig = {
    input: [
        './src/styles/*.{css,pcss,scss,sass,less,styl,stylus}',
        './src/scripts/*.{js,ts,mjs}'
    ],
    formats: ['json', 'latte', 'twig', 'liquid', 'njk', 'hbs', 'pug'],
    pages: defaultConfigPages,
    imports: defaultConfigImports
}

const defaultInput = [
    'index.html',
    './src/pages/**/*.{json,latte,twig,liquid,njk,hbs,pug,html}',
    '!./src/pages/**/*.{latte,twig,liquid,njk,hbs,pug,html}.json'
]

/**
 * @param {import('vituum').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const pluginCore = (pluginUserConfig) => {
    let userConfig

    return {
        name: '@vituum/vite-plugin-core',
        enforce: 'pre',
        config (config) {
            userConfig = config

            if (!userConfig?.optimizeDeps?.entries) {
                userConfig.optimizeDeps = userConfig.optimizeDeps || {}
                userConfig.optimizeDeps.entries = []
            }

            if (userConfig?.build?.rollupOptions?.input) {
                userConfig.build.rollupOptions.input = resolveInputPaths({ paths: userConfig.build.rollupOptions.input, root: userConfig.root }, pluginUserConfig.formats)
            } else {
                defaultInput.push(...pluginUserConfig.input)
                userConfig.build = userConfig.build || {}
                userConfig.build.rollupOptions = userConfig.build.rollupOptions || {}
                userConfig.build.rollupOptions.input = resolveInputPaths({ paths: defaultInput, root: userConfig.root }, pluginUserConfig.formats)
            }
        }
    }
}

/**
 * @param {import('vituum').UserConfig} pluginUserConfig
 * @returns [...import('vite').Plugin]
 */
const plugin = (pluginUserConfig = {}) => {
    pluginUserConfig = merge(defaultConfig, pluginUserConfig)

    return [pluginCore(pluginUserConfig), pluginPages(pluginUserConfig.pages), pluginImports(pluginUserConfig.imports)]
}

export default plugin
