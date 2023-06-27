import vituum from 'vituum'
import nunjucks from '@vituum/vite-plugin-nunjucks'

export default {
    plugins: [vituum(), nunjucks({
        root: './src'
    })]
}
