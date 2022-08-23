import { defineConfig } from 'vituum'
import postcssOpenProps from 'postcss-jit-props'
import OpenProps from 'open-props'

export default defineConfig({
    postcss: {
        plugins: [postcssOpenProps(OpenProps)]
    }
})
