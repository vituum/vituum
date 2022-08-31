import { defineConfig } from 'vituum'

export default defineConfig({
    imports: {
        filenamePattern: {
            '+.css': false,
            '+.scss': 'src/styles'
        }
    }
})
