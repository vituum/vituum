import { defineConfig } from 'vituum'

export default defineConfig({
    imports: {
        filenamePattern: {
            '+.css': false,
            '+.less': 'src/styles'
        }
    }
})
