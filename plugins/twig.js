import { dirname, extname, resolve, relative } from 'path'
import fs from 'fs'
import process from 'node:process'
import FastGlob from 'fast-glob'
import lodash from 'lodash'
import Twig from 'twig'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

const { name } = JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(import.meta.url))), '../package.json')).toString())
const defaultOptions = {
    filters: {},
    functions: {},
    extensions: [],
    globals: {},
    namespaces: {},
    data: '',
    filetypes: {
        html: /.(json.html|twig.json.html|twig.html)$/,
        json: /.(json.twig.html)$/
    }
}

function processData(paths, data = {}) {
    let context = {}

    lodash.merge(context, data)

    FastGlob.sync(paths).forEach(entry => {
        const path = resolve(process.cwd(), entry)

        context = lodash.merge(context, JSON.parse(fs.readFileSync(path).toString()))
    })

    return context
}

const renderTemplate = (filename, content, options) => {
    const output = {}
    const context = processData(options.data, options.globals)

    Twig.cache(false)

    if (!Array.isArray(options.extensions)) {
        throw new TypeError('\'extensions\' needs to be an array of functions!')
    } else {
        options.extensions.forEach((name) => {
            Twig.extend(name)
        })
    }

    Object.keys(options.functions).forEach(name => {
        if (typeof options.functions[name] !== 'function') {
            throw new TypeError(`${name} needs to be a function!`)
        }

        Twig.extendFunction(name, options.functions[name])
    })

    Object.keys(options.filters).forEach(name => {
        if (typeof options.filters[name] !== 'function') {
            throw new TypeError(`${name} needs to be a function!`)
        }

        Twig.extendFilter(name, options.filters[name])
    })

    if (
        filename.endsWith('.json.html') ||
        filename.endsWith('.json')
    ) {
        lodash.merge(context, JSON.parse(fs.readFileSync(filename).toString()))

        content = '{% include template %}'
        filename = options.root

        context.template = relative(process.cwd(), context.template)
    } else if (fs.existsSync(filename + '.json')) {
        lodash.merge(context, JSON.parse(fs.readFileSync(filename + '.json').toString()))
    }

    try {
        output.content = Twig.twig({
            async: true,
            data: content,
            path: filename,
            namespaces: options.namespaces,
            rethrow: true
        }).render(context)
    } catch (error) {
        output.error = error
    }

    return output
}

const plugin = (options = {}) => {
    options = lodash.merge(defaultOptions, options)

    return {
        name,
        config: ({ root }) => {
            options.root = root
        },
        transformIndexHtml: {
            enforce: 'pre',
            async transform(content, { path, filename, server }) {
                if (
                    !options.filetypes.html.test(path) &&
                    !options.filetypes.json.test(path) &&
                    !content.startsWith('<script type="application/json"')
                ) {
                    return content
                }

                if (content.startsWith('<script type="application/json"') && !content.includes('data-format="twig"')) {
                    return content
                }

                const render = renderTemplate(filename, content, options)

                if (render.error) {
                    if (!server) {
                        console.error(chalk.red(render.error))
                        return
                    }

                    server.ws.send({
                        type: 'error',
                        err: {
                            message: render.error.message,
                            plugin: '@vituum/vite-plugin-twig'
                        }
                    })

                    return '<html style="background: #222"><head></head><body></body></html>'
                }

                return render.content
            }
        },
        handleHotUpdate({ file, server }) {
            if (extname(file) === '.twig' || extname(file) === '.html' || extname(file) === '.json') {
                server.ws.send({ type: 'full-reload' })
            }
        }
    }
}

export default plugin
