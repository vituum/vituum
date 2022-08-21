import posthtml from '@vituum/vite-plugin-posthtml'

const integration = (userConfig = {}) => {
    return {
        plugin: () => posthtml(userConfig)
    }
}

export default integration
