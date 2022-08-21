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

const config = {
    input: ['./src/views/**/*.html', './src/emails/*.html', './src/styles/*.css', './src/scripts/*.js'],
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
        formats: ['json', 'latte', 'twig', 'liquid', 'njk']
    },
    postcss: {
        plugins: [postcssImport, postcssNesting, postcssCustomMedia, postcssCustomSelectors, autoprefixer]
    },
    vite: {
        server: {
            host: true,
            fsServe: {
                strict: false
            }
        },
        build: {
            emptyOutDir: false,
            polyfillModulePreload: false
        }
    }
}

function userConfig(userConfig) {
    lodash.merge(config, userConfig)

    const plugins = [
        vitePluginMiddleware,
        vitePluginImports()
    ]

    config.integrations.forEach(integration => {
        if (integration.plugin) {
            plugins.push(integration.plugin(config))
        }

        if (integration.config) {
            lodash.merge(config, integration.config)
        }
    })

    plugins.push({
        name: '@vituum/vite-plugin-reload',
        handleHotUpdate({ file, server }) {
            if (typeof config.server.reload === 'function' && config.server.reload(file)) {
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                })
            }
        }
    })

    plugins.push(...plugins)

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

    return defineConfig(lodash.merge({
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
            postcss: config.postcss
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

export { userConfig as defineConfig, config }
