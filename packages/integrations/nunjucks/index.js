import nunjucks from '@vituum/vite-plugin-nunjucks'
import lodash from 'lodash'
import { resolve } from 'path'

const integration = (userConfig = {}) => {
    return {
        plugin: (config) => nunjucks(lodash.merge({
            data: resolve(config.root, 'data/**/*.json'),
            filetypes: {
                html: (config.templates.format === 'njk' || config.templates.format === 'nunjucks') ? /.(json|json.html|njk.json|njk.json.html|njk|njk.html)$/ : /.(njk.json|njk.json.html|njk|njk.html)$/,
                json: /.(json.njk|json.njk.html)$/
            }
        }, userConfig))
    }
}

export default integration
