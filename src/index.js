import { join } from 'node:path'
import pluginPages, { defaultConfig as defaultConfigPages } from './plugins/pages.js'
import pluginImports, { defaultConfig as defaultConfigImports } from './plugins/imports.js'
import { resolveInputPaths } from './utils/build.js'
import { merge, normalizePath } from './utils/common.js'

const TEMPLATE_FORMATS = ['latte', 'twig', 'liquid', 'njk', 'hbs', 'pug']
const templateExtensions = (...additionalFormats) => ([...additionalFormats, ...TEMPLATE_FORMATS].join(','))

const defaultConfig = {
    input: [],
    formats: ['json', ...TEMPLATE_FORMATS],
    pages: defaultConfigPages,
    imports: defaultConfigImports
}

/**
 * @param {import('vituum').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const pluginCore = (pluginUserConfig) => {
    const pagesRoot = normalizePath(pluginUserConfig.pages.root)
    const pagesPath = normalizePath(pluginUserConfig.pages.dir)

    const defaultInput = [
        'index.html',
        join(pagesPath, `**/*.{${templateExtensions('json', 'html')}}`),
        '!' + join(pagesPath, `**/*.{${templateExtensions('html')}}.json`),
        join(pagesRoot, 'styles/*.{css,pcss,scss,sass,less,styl,stylus}'),
        join(pagesRoot, 'scripts/*.{js,ts,mjs}'),
        ...pluginUserConfig.input
    ]
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
