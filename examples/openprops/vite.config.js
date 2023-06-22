import vituum from 'vituum'
import postcssOpenProps from 'postcss-jit-props'
import OpenProps from 'open-props'

export default {
    plugins: [vituum()],
    css: {
        postcss: {
            plugins: [postcssOpenProps(OpenProps)]
        }
    }
}
