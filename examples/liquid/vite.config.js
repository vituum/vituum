import { defineConfig } from 'vituum'
import liquid from '@vituum/liquid'

export default defineConfig({
    integrations: [liquid()],
    templates: {
        format: 'liquid'
    }
})
