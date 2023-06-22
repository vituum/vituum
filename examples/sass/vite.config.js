import vituum from 'vituum'

export default {
    plugins: [
        vituum({
            imports: {
                filenamePattern: {
                    '+.css': [],
                    '+.scss': 'src/styles'
                }
            }
        })
    ]
}
