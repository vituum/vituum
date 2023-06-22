import vituum from 'vituum'
import posthtml from '@vituum/vite-plugin-posthtml'

export default {
    plugins: [vituum(), posthtml({
        root: './src'
    })]
}
