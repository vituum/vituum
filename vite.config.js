import { defineConfig } from './index.js'
import { resolve } from 'path'

// Vituum defaults
export default defineConfig({
    input: ['./src/views/**/*.html', './src/styles/**/*.css', './src/scripts/**/*.js'],
    output: 'public',
    root: resolve(process.cwd(), 'src'),
    server: {
        open: '/',
        https: true,
        cert: 'localhost',
        reload: file => (file.endsWith('.php') && !file.includes('temp/')),
        run: {}
    },
    templates: {
        format: 'latte',
        latte: {
            functions: {
                pages: () => {}
            }
        }
    },
    styles: {
        autoimport: ['Components/**/*.css', 'Sections/**/*.css', 'Layout/**/*.css', 'Libraries/**/*.css', 'Ui/**/*.css'],
        postcss: {}
    },
    scripts: {
        autoImport: ['Components/**/*.js', 'Sections/**/*.js', 'Layout/**/*.js', 'Libraries/**/*.js', 'Utils/Functions/**/*.js', 'Ui/**/*.js']
    },
    emails: {
        distDir: ''
    },
    vite: {}
})
