import lodash from 'lodash'
import posthtmlExpressions from 'posthtml-expressions'
import posthtmlExtend from 'posthtml-extend'
import { dirname } from 'path'
import posthtmlInclude from 'posthtml-include'
import posthtml from 'posthtml'

const vitePluginPosthtml = (pluginOptions = {}) => {
    pluginOptions = lodash.merge({
        options: {},
        locals: {},
        plugins: []
    }, pluginOptions)

    return {
        name: '@vituum/vite-plugin-posthtml',
        transformIndexHtml: {
            transform: async(html, { filename }) => {
                const plugins = [
                    posthtmlExpressions({ locals: pluginOptions.locals }),
                    posthtmlExtend({ encoding: 'utf8', root: dirname(filename) }),
                    posthtmlInclude({ encoding: 'utf8', root: dirname(filename) })
                ]

                const result = await posthtml(plugins.concat(...pluginOptions.plugins)).process(html, pluginOptions.options || {})

                return result.html
            }
        }
    }
}

export default vitePluginPosthtml
