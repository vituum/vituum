import { defineConfig } from './index.js'
import { resolve } from 'path'

export default defineConfig({
    input: ['./playground/views/**/*.html', './playground/styles/**/*.css', './playground/scripts/**/*.js'],
    root: resolve(process.cwd(), 'playground'),
    server: {
        https: true,
        run: {}
    },
    templates: {
        format: 'latte',
        latte: {
            globals: {
                template: resolve(process.cwd(), 'playground/templates/latte/Layout/Main.latte'),
                srcPath: resolve(process.cwd(), 'playground')
            },
            data: './playground/data/**/*.json'
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
