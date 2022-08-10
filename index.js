import { defineConfig } from 'vite'
import { resolve, join } from 'path'
import os from 'os'
import FastGlob from 'fast-glob'
import lodash from 'lodash'
import chalk from 'chalk'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomSelectors from 'postcss-custom-selectors'
import fs from 'fs'
import run from 'vite-plugin-run'
import vitePluginJuice from './plugins/juice.js'
import vitePluginPosthtml from './plugins/posthtml.js'
import vitePluginImports from './plugins/imports.js'
import vitePluginMiddleware from './plugins/middleware.js'

const optionalPlugin = {}

async function definePackage(plugin) {
    try {
        optionalPlugin[plugin] = (await import(plugin)).default
    } catch {}
}

await definePackage('tailwindcss')
await definePackage('tailwindcss/nesting/index.js')
await definePackage('vite-plugin-latte')
await definePackage('vite-plugin-twig')

const config = {
    input: ['./src/views/**/*.html', './src/emails/*.html', './src/styles/*.css', './src/scripts/*.js'],
    output: resolve(process.cwd(), 'public'),
    root: resolve(process.cwd(), 'src'),
    plugins: [],
    build: {
        log: false,
        headless: false
    },
    server: {
        open: '/',
        https: false,
        cert: 'localhost',
        run: []
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
        viewsIgnoredPaths: ['emails'],
        contentTypeJsonPaths: ['views/dialog']
    },
    templates: {
        latte: {},
        twig: {},
        posthtml: {}
    },
    styles: {
        tailwindcss: true,
        postcss: {
            plugins: [postcssImport, postcssNesting, postcssCustomMedia, postcssCustomSelectors, autoprefixer]
        },
        juice: {
            paths: ['emails'],
            options: {}
        }
    },
    emails: {
        send: {
            template: null,
            from: 'example@example.com',
            to: null,
            host: null,
            user: null,
            pass: null
        }
    },
    vite: {
        server: {
            host: true,
            fsServe: {
                strict: false
            }
        },
        build: {
            manifest: true,
            emptyOutDir: false,
            polyfillModulePreload: false
        }
    }
}

function userConfig(userConfig) {
    lodash.merge(config, userConfig)

    const plugins = [
        vitePluginMiddleware,
        vitePluginPosthtml(config.templates.posthtml),
        vitePluginJuice(config.styles.juice),
        vitePluginImports()
    ]

    if (optionalPlugin['vite-plugin-latte'] && config.templates.latte) {
        plugins.push(optionalPlugin['vite-plugin-latte'](lodash.merge({
            globals: {
                srcPath: resolve(process.cwd(), 'src')
            },
            data: './src/data/**/*.json'
        }, config.templates.latte)))
    } else {
        console.error(chalk.red('vite-plugin-latte not installed'))
    }

    if (optionalPlugin['vite-plugin-twig'] && config.templates.twig) {
        plugins.push(optionalPlugin['vite-plugin-twig'](lodash.merge({}, config.templates.twig)))
    } else {
        console.error(chalk.red('vite-plugin-twig not installed'))
    }

    if (config.styles.tailwindcss) {
        if (optionalPlugin.tailwindcss) {
            config.styles.postcss.plugins = [postcssImport, optionalPlugin['tailwindcss/nesting/index.js'](postcssNesting), postcssCustomMedia, postcssCustomSelectors, optionalPlugin.tailwindcss, autoprefixer]
        } else {
            console.error(chalk.red('tailwindcss not installed'))
        }
    }

    plugins.push(run(config.server.run))
    plugins.push(...plugins)

    if (config.server.https && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`)) && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`))) {
        config.vite.server = {
            https: {
                key: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`)),
                cert: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`))
            }
        }
    }

    if (config.build.headless) {
        config.input.push('!**/*.html')
    }

    return defineConfig(lodash.merge({
        vituum: config,
        plugins,
        resolve: {
            alias: {
                '/src': config.root
            }
        },
        root: config.root,
        publicDir: config.output,
        css: {
            postcss: config.styles.postcss
        },
        build: {
            outDir: config.output,
            rollupOptions: {
                input: FastGlob.sync(config.input).map(entry => resolve(process.cwd(), entry))
            }
        }
    }, config.vite))
}

export { userConfig as defineConfig, config }
