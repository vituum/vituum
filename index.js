import { defineConfig } from 'vite'
import { resolve, join } from 'path'
import os from 'os'
import fs from 'fs'
import FastGlob from 'fast-glob'
import lodash from 'lodash'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomSelectors from 'postcss-custom-selectors'
import vitePluginImports from './plugins/imports.js'
import vitePluginMiddleware from './plugins/middleware.js'
import vitePluginReload from './plugins/reload.js'
import { merge } from './utils/common.js'

const config = {
    input: ['./src/views/**/*.html', './src/emails/*.html', './src/styles/*.{css,pcss,scss,sass,less,styl,stylus}', './src/scripts/*.{js,ts,mjs}'],
    output: resolve(process.cwd(), 'public'),
    root: resolve(process.cwd(), 'src'),
    integrations: [],
    plugins: [],
    build: {
        log: false,
        manifest: true,
        mode: null || process.env.VITUUM_BUILD_MODE
    },
    server: {
        open: false,
        https: false,
        cert: 'localhost',
        reload: null
    },
    imports: {
        paths: ['./src/styles/**', './src/scripts/**'],
        extnamePattern: {
            styles: /.(css|less|scss|pcss)$/,
            scripts: /.(js|mjs|ts)$/
        },
        filenamePattern: {
            '+.css': 'src/styles',
            '+.js': 'src/scripts'
        }
    },
    middleware: {
        viewsDir: 'views',
        viewsIgnoredPaths: ['emails']
    },
    templates: {
        format: null,
        formats: ['json', 'latte', 'twig', 'liquid', 'njk', 'hbs', 'pug']
    },
    postcss: {
        plugins: []
    },
    vite: {
        server: {
            host: true,
            fsServe: {
                strict: false
            }
        },
        css: {
            postcss: {
                plugins: [postcssImport, postcssNesting, postcssCustomMedia, postcssCustomSelectors, autoprefixer]
            }
        },
        build: {
            emptyOutDir: false,
            polyfillModulePreload: false
        }
    }
}

function loadIntegrations(integrations, plugins) {
    integrations.forEach(integration => {
        if (integration.plugin) {
            plugins.push(integration.plugin(config))
        }

        if (integration.config) {
            merge(config, integration.config)

            if (integration.config.integrations) {
                loadIntegrations(integration.config.integrations, plugins)
            }
        }
    })
}

function userConfig(userConfig) {
    merge(config, userConfig)

    config.output = resolve(process.cwd(), config.output)
    config.root = resolve(process.cwd(), config.root)
    config.middleware.viewsDir = resolve(config.root, config.middleware.viewsDir)

    const plugins = []

    if (config.server.reload) {
        plugins.push(vitePluginReload)
    }

    if (config.middleware) {
        plugins.push(vitePluginMiddleware)
    }

    if (config.imports) {
        plugins.push(vitePluginImports())
    }

    loadIntegrations(config.integrations, plugins)

    plugins.push(...config.plugins)

    const postcss = !userConfig?.vite?.css?.postcss ? lodash.mergeWith(config.vite.css.postcss, config.postcss, (objValue, srcValue) => {
        if (lodash.isArray(objValue)) {
            return objValue.concat(srcValue)
        }
    }) : userConfig.vite.css.postcss

    if (config.server.https && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`)) && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`))) {
        config.vite.server = Object.assign(config.vite.server, {
            https: {
                key: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`)),
                cert: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`))
            }
        })
    }

    if (config.build.mode === 'headless') {
        config.input.push('!**/*.html')
    }

    return defineConfig(merge({
        vituum: config,
        server: {
            open: config.server.open
        },
        plugins,
        resolve: {
            alias: {
                '/src': config.root
            }
        },
        root: config.root,
        publicDir: config.output,
        css: {
            postcss
        },
        build: {
            outDir: config.output,
            manifest: config.build.manifest,
            rollupOptions: {
                input: FastGlob.sync(config.input).map(entry => resolve(process.cwd(), entry))
            }
        }
    }, config.vite))
}

export { userConfig as defineConfig }
