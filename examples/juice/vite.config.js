import { defineConfig } from 'vituum'
import posthtml from '@vituum/posthtml'
import juice from '@vituum/juice'

export default defineConfig({
    integrations: [posthtml(), juice()]
})
