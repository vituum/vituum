import vituum from '../src/index.js'
import { dirname, resolve } from 'path'
import juice from '@vituum/vite-plugin-juice'
import posthtml from '@vituum/vite-plugin-posthtml'
import tailwindcss from '@vituum/vite-plugin-tailwindcss'
import twig from '@vituum/vite-plugin-twig'
import latte from '@vituum/vite-plugin-latte'
import liquid from '@vituum/vite-plugin-liquid'
import nunjucks from '@vituum/vite-plugin-nunjucks'
import handlebars from '@vituum/vite-plugin-handlebars'
import pug from '@vituum/vite-plugin-pug'

// this is a playground config for testing
export default {
    plugins: [
        vituum(),
        posthtml(), juice(), tailwindcss(),
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
            renderTransformedHtml: (filename) => dirname(filename).endsWith('emails')
        }),
        liquid({
            globals: {
                template: resolve(process.cwd(), 'src/templates/twig/article.liquid')
            },
            tags: {
                upper: {
                    parse: function (tagToken) {
                        this.str = tagToken.args
                    },
                    render: async function (ctx) {
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
                template: 'src/templates/hbs/article.hbs'
            }
        }),
        pug({
            globals: {
                template: resolve(process.cwd(), 'src/templates/pug/article.pug')
            },
            filters: {
                'my-own-filter': function (text, options) {
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
}
