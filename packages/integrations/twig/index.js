import twig from '@vituum/vite-plugin-twig'
import lodash from 'lodash'
import { resolve } from 'path'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => twig(lodash.merge({
            globals: {
                srcPath: resolve(process.cwd(), 'src')
            },
            data: './src/data/**/*.json',
            filetypes: {
                html: config.templates.format === 'twig' ? /.(json|json.html|twig.json|twig.json.html|twig|twig.html)$/ : /.(twig.json|twig.json.html|twig|twig.html)$/,
                json: /.(json.twig|json.twig.html)$/
            }
        }, userConfig))
    }
}

export default integration
