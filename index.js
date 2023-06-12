import pluginPages from './plugins/pages.js'

const plugin = (pluginUserConfig) => {
    return [pluginPages(pluginUserConfig)]
}

export default plugin
