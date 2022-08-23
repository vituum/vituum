import { defineConfig } from 'vituum'

export default defineConfig({
    imports: {
        filenamePattern: {
            '+.scss': 'src/styles'
        }
    }
})
