import { defineConfig } from './index.js'
import { dirname, resolve } from 'path'

export default defineConfig({
    input: ['./playground/views/**/*.html', './playground/emails/*.html', './playground/styles/**/*.css', './playground/scripts/**/*.js'],
    root: resolve(process.cwd(), 'playground'),
    build: {
        log: true
    },
    server: {
        https: true,
        run: {}
    },
    autoImport: {
        paths: ['./playground/styles/**/*.css', './playground/scripts/**/*.js'],
        filename: '+'
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
        }
    },
    emails: {
        copyDir: '',
        send: {
            template: '',
            from: '',
            to: ''
        }
    },
    vite: {}
})
