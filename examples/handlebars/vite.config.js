import { defineConfig } from 'vituum'
import handlebars from '@vituum/handlebars'

export default defineConfig({
    integrations: [handlebars()],
    templates: {
        format: 'hbs'
    }
})
