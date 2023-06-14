import pluginPages from './plugins/pages.js'
import pluginImports from './plugins/imports.js'
import { resolveInputPaths, renameGenerateBundle } from './utils/build.js'
import { relative } from 'path'

const defaultInput = [
    './src/emails/**/*.{json,latte,twig,liquid,njk,hbs,pug,html}',
    './src/pages/**/*.{json,latte,twig,liquid,njk,hbs,pug,html}',
    '!./src/pages/**/*.{latte,twig,liquid,njk,hbs,pug,html}.json',
    './src/styles/*.{css,pcss,scss,sass,less,styl,stylus}',
    './src/scripts/*.{js,ts,mjs}'
]

/**
 * @param {import('./index.d.ts').UserConfig} pluginUserConfig
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
                userConfig.build.rollupOptions.input = resolveInputPaths(userConfig.build.rollupOptions.input, pluginUserConfig.pages.formats)
            } else {
                userConfig.build = userConfig.build || {}
                userConfig.build.rollupOptions = userConfig.build.rollupOptions || {}
                userConfig.build.rollupOptions.input = resolveInputPaths(defaultInput, pluginUserConfig.pages.formats)
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
    }
}

/**
 * @param {import('./index.d.ts').UserConfig} pluginUserConfig
 * @returns [import('vite').Plugin]
 */
const plugin = (pluginUserConfig) => {
    return [pluginCore(pluginUserConfig), pluginPages(pluginUserConfig.pages), pluginImports(pluginUserConfig.imports)]
}

export default plugin
