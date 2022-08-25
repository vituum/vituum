import handlebars from '@vituum/vite-plugin-handlebars'
import lodash from 'lodash'
import { resolve } from 'path'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => handlebars(lodash.merge({
            data: resolve(config.root, 'data/**/*.json'),
            filetypes: {
                html: config.templates.format === 'hbs' ? /.(json|json.html|hbs.json|hbs.json.html|hbs|hbs.html)$/ : /.(hbs.json|hbs.json.html|hbs|hbs.html)$/,
                json: /.(json.hbs|json.hbs.html)$/
            }
        }, userConfig))
    }
}

export default integration
