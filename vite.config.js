import { defineConfig } from './index.js'
import { dirname, resolve } from 'path'

export default defineConfig({
    input: ['./playground/views/**/*.html', './playground/emails/*.html', './playground/styles/*.css', './playground/scripts/*.js'],
    root: resolve(process.cwd(), 'playground'),
    build: {
        log: true
    },
    server: {
        https: true
    },
    imports: {
        paths: ['./playground/styles/**', './playground/scripts/**'],
        filenamePattern: {
            '+.css': 'playground/styles',
            '+.js': 'playground/scripts'
        }
    },
    middleware: {
        contentTypeJsonPaths: ['views/dialog']
    },
    styles: {
        tailwindcss: true
    },
    templates: {
        latte: {
            globals: {
                template: resolve(process.cwd(), 'playground/templates/latte/Layout/Main.latte'),
                srcPath: resolve(process.cwd(), 'playground'),
                baseUrl: 'https://www.seznam.cz'
            },
            data: './playground/data/**/*.json',
            isStringFilter: (filename) => dirname(filename).endsWith('emails')
        },
        twig: {
            globals: {
                template: resolve(process.cwd(), 'playground/templates/twig/article.twig'),
                srcPath: resolve(process.cwd(), 'playground'),
                baseUrl: 'https://www.seznam.cz'
            },
            namespaces: {
                templates: resolve(process.cwd(), 'playground/templates')
            },
            data: './playground/data/**/*.json'
        }
    },
    emails: {
        send: {
            template: 'public/example.html',
            from: 'lubomir.blazek@newlogic.cz',
            to: 'lubomir.blazek@newlogic.cz'
        }
    },
    vite: {}
})
