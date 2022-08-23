import { defineConfig } from 'vituum'
import twig from '@vituum/twig'

export default defineConfig({
    integrations: [twig()],
    templates: {
        format: 'twig'
    }
})
