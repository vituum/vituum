import { defineConfig } from '../index.js'
import { dirname, resolve } from 'path'
import juice from '@vituum/juice'
import posthtml from '@vituum/posthtml'
import tailwind from '@vituum/tailwind'
import twig from '@vituum/twig'
import latte from '@vituum/latte'
import liquid from '@vituum/liquid'
import nunjucks from '@vituum/nunjucks'
import handlebars from '@vituum/handlebars'
import pug from '@vituum/pug'

// this is a playground config for testing
const integrations = [
    posthtml(), juice(), tailwind(),
    twig({
        globals: {
            template: resolve(process.cwd(), 'src/templates/twig/article.twig')
        },
        namespaces: {
            templates: resolve(process.cwd(), 'src/templates')
        }
    }),
    latte({
        globals: {
            template: resolve(process.cwd(), 'src/templates/latte/Layout/Main.latte')
        },
        data: './src/data/**/*.json',
        isStringFilter: (filename) => dirname(filename).endsWith('emails')
    }),
    liquid({
        globals: {
            template: 'templates/twig/article.liquid'
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
        }
    }),
    nunjucks({
        globals: {
            template: 'templates/twig/article.twig'
        }
    }),
    handlebars({
        globals: {
            template: 'templates/hbs/article.hbs'
        }
    }),
    pug({
        globals: {
            template: resolve(process.cwd(), 'src/templates/pug/article.pug')
        },
        filters: {
            'my-own-filter': function(text, options) {
                if (options.addStart) {
                    text = 'Start\n' + text
                }
                if (options.addEnd) {
                    text = text + '\nEnd'
                }
                return text
            }
        }
    })
]

const config = defineConfig({
    integrations,
    build: {
        log: true
    },
    server: {
        https: true
    },
    templates: {
        format: 'pug'
    }
})

export default config
