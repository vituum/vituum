import pug from '@vituum/vite-plugin-pug'
import lodash from 'lodash'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => pug(lodash.merge({
            globals: {
                srcPath: config.root
            },
            data: './src/data/**/*.json',
            filetypes: {
                html: config.templates.format === 'pug' ? /.(json|json.html|pug.json|pug.json.html|pug|pug.html)$/ : /.(pug.json|pug.json.html|pug|pug.html)$/,
                json: /.(json.pug|json.pug.html)$/
            }
        }, userConfig))
    }
}

export default integration
