import { defineConfig } from 'vite'
import { resolve, join } from 'path'
import os from 'os'
import fs from 'fs'
import FastGlob from 'fast-glob'
import lodash from 'lodash'
import chalk from 'chalk'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomSelectors from 'postcss-custom-selectors'
import vitePluginJuice from './plugins/juice.js'
import vitePluginPosthtml from './plugins/posthtml.js'
import vitePluginImports from './plugins/imports.js'
import vitePluginMiddleware from './plugins/middleware.js'
import vitePluginTwig from './plugins/twig.js'

const optionalPlugin = {}

async function definePackage(plugin) {
    try {
        optionalPlugin[plugin] = (await import(plugin)).default
    } catch {}
}

await definePackage('tailwindcss')
await definePackage('tailwindcss/nesting/index.js')
await definePackage('@vituum/vite-plugin-latte')
await definePackage('vite-plugin-twig')

const config = {
    input: ['./src/views/**/*.html', './src/emails/*.html', './src/styles/*.css', './src/scripts/*.js'],
    output: resolve(process.cwd(), 'public'),
    root: resolve(process.cwd(), 'src'),
    plugins: [],
    build: {
        log: false,
        manifest: true,
        mode: null || process.env.VITUUM_BUILD_MODE
    },
    server: {
        open: false,
        https: false,
        cert: 'localhost'
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
        format: 'twig',
        latte: {},
        twig: {},
        posthtml: {}
    },
    styles: {
        tailwindcss: false,
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

    if (optionalPlugin['@vituum/vite-plugin-latte'] && config.templates.latte) {
        plugins.push(optionalPlugin['@vituum/vite-plugin-latte'](lodash.merge({
            globals: {
                srcPath: resolve(process.cwd(), 'src')
            },
            data: './src/data/**/*.json',
            filetypes: {
                html: config.templates.format === 'latte' ? /.(json|json.html|latte.json|latte.json.html|latte|latte.html)$/ : /.(latte.json|latte.json.html|latte|latte.html)$/,
                json: /.(json.latte|json.latte.html)$/
            }
        }, config.templates.latte)))
    } else {
        console.error(chalk.red('@vituum/vite-plugin-latte not installed'))
    }

    plugins.push(vitePluginTwig(lodash.merge({
        globals: {
            srcPath: resolve(process.cwd(), 'src')
        },
        data: './src/data/**/*.json',
        filetypes: {
            html: config.templates.format === 'twig' ? /.(json|json.html|twig.json|twig.json.html|twig|twig.html)$/ : /.(twig.json|twig.json.html|twig|twig.html)$/,
            json: /.(json.twig|json.twig.html)$/
        }
    }, config.templates.twig)))

    if (config.styles.tailwindcss) {
        if (optionalPlugin.tailwindcss) {
            config.styles.postcss.plugins = [postcssImport, optionalPlugin['tailwindcss/nesting/index.js'](postcssNesting), postcssCustomMedia, postcssCustomSelectors, optionalPlugin.tailwindcss, autoprefixer]
        } else {
            console.error(chalk.red('tailwindcss not installed'))
        }
    }

    plugins.push(...plugins)

    if (config.server.https && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`)) && fs.existsSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`))) {
        config.vite.server = {
            https: {
                key: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}-key.pem`)),
                cert: fs.readFileSync(join(os.homedir(), `.ssh/${config.server.cert}.pem`))
            }
        }
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
            postcss: config.styles.postcss
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
