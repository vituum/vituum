import vituum from 'vituum'
import postcss from '@vituum/vite-plugin-postcss'
import posthtml from '@vituum/vite-plugin-posthtml'
import juice from '@vituum/vite-plugin-juice'

export default {
    plugins: [
        vituum(),
        postcss(),
        posthtml({
            root: './src/emails'
        }),
        juice()
    ]
}
