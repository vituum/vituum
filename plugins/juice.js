import postcss from 'postcss'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssHtml from 'postcss-html'
import juice from 'juice'

const vitePluginJuice = (options = {}) => {
    return {
        name: '@vituum/vite-plugin-juice',
        enforce: 'post',
        transformIndexHtml: {
            enforce: 'post',
            transform: (html, { path }) => {
                if (!path.startsWith('/emails')) {
                    return html
                }

                html = html.replaceAll('<table', '<table border="0" cellpadding="0" cellspacing="0"')

                const result = postcss([postcssCustomProperties({
                    preserve: false
                })]).process(html, { syntax: postcssHtml() })

                return juice(result.content, options)
            }
        }
    }
}

export default vitePluginJuice
