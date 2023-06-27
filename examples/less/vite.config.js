import vituum from 'vituum'

export default {
    plugins: [
        vituum({
            imports: {
                filenamePattern: {
                    '+.css': [],
                    '+.less': 'src/styles'
                }
            }
        })
    ]
}
