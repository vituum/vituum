import tailwind from '@vituum/tailwind'
import posthtml from '@vituum/posthtml'
import juice from '@vituum/juice'
import twig from '@vituum/twig'
import latte from '@vituum/latte'
import lodash from 'lodash'

const defaultConfig = {
    posthtml: {},
    juice: {},
    tailwind: {},
    twig: {},
    latte: {}
}

const integration = (userConfig = {}) => {
    userConfig = lodash.merge(defaultConfig, userConfig)

    return {
        config: {
            integrations: [posthtml(userConfig.posthtml), juice(userConfig.juice), tailwind(userConfig.tailwind), twig(userConfig.twig), latte(userConfig.latte)],
            server: {
                open: true,
                https: true,
                reload: file => (file.endsWith('.tpl') || file.endsWith('.latte')) && !file.includes('temp/')
            },
            templates: {
                format: 'twig'
            }
        }
    }
}

export default integration
