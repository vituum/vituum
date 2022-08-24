import { defineConfig } from './index.js'
import { dirname, resolve } from 'path'
import juice from '@vituum/juice'
import posthtml from '@vituum/posthtml'
import tailwind from '@vituum/tailwind'
import twig from '@vituum/twig'
import latte from '@vituum/latte'
import liquid from '@vituum/liquid'
import nunjucks from '@vituum/nunjucks'

const integrations = [
    posthtml(), juice(), tailwind(),
    twig({
        globals: {
            template: resolve(process.cwd(), 'playground/templates/twig/article.twig'),
            srcPath: resolve(process.cwd(), 'playground'),
            baseUrl: 'https://www.seznam.cz'
        },
        namespaces: {
            templates: resolve(process.cwd(), 'playground/templates')
        },
        data: './playground/data/**/*.json'
    }),
    latte({
        globals: {
            template: resolve(process.cwd(), 'playground/templates/latte/Layout/Main.latte'),
            srcPath: resolve(process.cwd(), 'playground'),
            baseUrl: 'https://www.seznam.cz'
        },
        data: './playground/data/**/*.json',
        isStringFilter: (filename) => dirname(filename).endsWith('emails')
    }),
    liquid({
        globals: {
            template: 'templates/twig/article.liquid',
            srcPath: resolve(process.cwd(), 'playground'),
            baseUrl: 'https://www.seznam.cz'
        },
        tags: {
            upper: {
                parse: function(tagToken) {
                    this.str = tagToken.args
                },
                render: async function(ctx) {
                    const str = await this.liquid.evalValue(this.str, ctx)
                    return str.toUpperCase()
                }
            }
        },
        data: './playground/data/**/*.json'
    }),
    nunjucks({
        globals: {
            template: 'templates/twig/article.twig',
            srcPath: resolve(process.cwd(), 'playground'),
            baseUrl: 'https://www.seznam.cz'
        },
        data: './playground/data/**/*.json'
    })
]

const config = defineConfig({
    input: ['./playground/views/**/*.html', './playground/emails/*.html', './playground/styles/*.css', './playground/scripts/*.js'],
    root: resolve(process.cwd(), 'playground'),
    integrations,
    postcss: {
        plugins: []
    },
    build: {
        log: true
    },
    server: {
        https: true
    },
    templates: {
        format: 'twig'
    },
    imports: {
        paths: ['./playground/styles/**', './playground/scripts/**'],
        filenamePattern: {
            'playground/styles': '+.css',
            'playground/scripts': '+.js'
        }
    }
})

export default config
