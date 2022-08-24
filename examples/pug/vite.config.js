import { defineConfig } from 'vituum'
import pug from '@vituum/pug'

export default defineConfig({
    integrations: [pug()],
    templates: {
        format: 'pug'
    }
})
