import { defineConfig } from 'vituum'
import nunjucks from '@vituum/nunjucks'

export default defineConfig({
    integrations: [nunjucks()],
    templates: {
        format: 'njk'
    }
})
