import liquid from '@vituum/vite-plugin-liquid'
import lodash from 'lodash'
import { resolve } from 'path'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => liquid(lodash.merge({
            globals: {
                srcPath: resolve(process.cwd(), 'src')
            },
            data: './src/data/**/*.json',
            filetypes: {
                html: config.templates.format === 'liquid' ? /.(json|json.html|liquid.json|liquid.json.html|liquid|liquid.html)$/ : /.(liquid.json|liquid.json.html|liquid|liquid.html)$/,
                json: /.(json.liquid|json.liquid.html)$/
            }
        }, userConfig))
    }
}

export default integration
