import { defineConfig } from 'vituum'

export default defineConfig({
    imports: {
        filenamePattern: {
            '+.less': 'src/styles'
        }
    }
})
