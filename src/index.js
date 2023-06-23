import pluginPages, { defaultConfig as defaultConfigPages } from './plugins/pages.js'
import pluginImports, { defaultConfig as defaultConfigImports } from './plugins/imports.js'
import { resolveInputPaths, renameGenerateBundle } from './utils/build.js'
import { merge } from './utils/common.js'
import { relative } from 'path'
import { normalizePath } from 'vite'

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
 * @param {import('vituum/types').UserConfig} pluginUserConfig
 * @returns {import('vite').Plugin}
 */
const pluginCore = (pluginUserConfig) => {
    let userConfig
    let resolvedConfig

    return {
        name: '@vituum/vite-plugin-core',
        enforce: 'post',
        config (config) {
            userConfig = config

            if (userConfig?.build?.rollupOptions?.input) {
                userConfig.build.rollupOptions.input = resolveInputPaths({ paths: userConfig.build.rollupOptions.input, root: userConfig.root }, pluginUserConfig.formats)
            } else {
                defaultInput.push(...pluginUserConfig.input)
                userConfig.build = userConfig.build || {}
                userConfig.build.rollupOptions = userConfig.build.rollupOptions || {}
                userConfig.build.rollupOptions.input = resolveInputPaths({ paths: defaultInput, root: userConfig.root }, pluginUserConfig.formats)
            }
        },
        configResolved (config) {
            resolvedConfig = config
        },
        generateBundle: async (_, bundle) => {
            await renameGenerateBundle(
                bundle,
                {
                    files: [...resolvedConfig.build.rollupOptions.input],
                    root: resolvedConfig.root
                },
                file => {
                    const pagesDir = normalizePath(relative(resolvedConfig.root, pluginUserConfig.pages.dir))
                    const pagesRoot = pluginUserConfig.pages.root ? normalizePath(relative(resolvedConfig.root, pluginUserConfig.pages.root)) : null

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
    }
}

/**
 * @param {import('vituum/types').UserConfig} pluginUserConfig
 * @returns [import('vite').Plugin]
 */
const plugin = (pluginUserConfig = {}) => {
    pluginUserConfig = merge(defaultConfig, pluginUserConfig)

    return [pluginCore(pluginUserConfig), pluginPages(pluginUserConfig.pages), pluginImports(pluginUserConfig.imports)]
}

export default plugin
