import { defineConfig } from 'vituum'
import posthtml from '@vituum/posthtml'

export default defineConfig({
    integrations: [posthtml()]
})
