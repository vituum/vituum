import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting/index.js'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCustomSelectors from 'postcss-custom-selectors'
import autoprefixer from 'autoprefixer'

const integration = (userConfig = {}) => {
    return {
        config: {
            vite: {
                css: {
                    postcss: {
                        plugins: [postcssImport, tailwindcssNesting(postcssNesting), postcssCustomMedia, postcssCustomSelectors, tailwindcss(userConfig), autoprefixer]
                    }
                }
            }
        }
    }
}

export default integration
