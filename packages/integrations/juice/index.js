import juice from '@vituum/vite-plugin-juice'
import lodash from 'lodash'
import send from './send.js'

const defaultConfig = {
    paths: ['views/email'],
    tables: true,
    send: {
        template: null,
        from: 'example@example.com',
        to: null,
        host: null,
        user: null,
        pass: null
    }
}

const integration = (userConfig = {}) => {
    userConfig = lodash.merge(defaultConfig, userConfig)

    return {
        plugin: () => juice(userConfig),
        task: {
            name: 'send',
            action: () => send(userConfig)
        }
    }
}

export default integration
