import { defineConfig } from 'vituum'

export default defineConfig({
    imports: {
        filenamePattern: {
            'src/styles': '+.less'
        }
    }
})
