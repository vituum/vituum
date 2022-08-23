import { defineConfig } from 'vituum'
import latte from '@vituum/latte'

export default defineConfig({
    integrations: [latte()],
    templates: {
        format: 'latte'
    }
})
