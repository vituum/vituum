import latte from '@vituum/vite-plugin-latte'
import lodash from 'lodash'
import { resolve } from 'path'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => latte(lodash.merge({
            globals: {
                srcPath: resolve(process.cwd(), 'src')
            },
            data: './src/data/**/*.json',
            filetypes: {
                html: config.templates.format === 'latte' ? /.(json|json.html|latte.json|latte.json.html|latte|latte.html)$/ : /.(latte.json|latte.json.html|latte|latte.html)$/,
                json: /.(json.latte|json.latte.html)$/
            }
        }, userConfig))
    }
}

export default integration
