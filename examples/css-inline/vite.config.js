import vituum from 'vituum'
import postcss from '@vituum/vite-plugin-postcss'
import posthtml from '@vituum/vite-plugin-posthtml'
import cssInline from '@vituum/vite-plugin-css-inline'

export default {
  plugins: [
    vituum(),
    postcss(),
    posthtml({
      root: './src/emails',
    }),
    cssInline(),
  ],
}
