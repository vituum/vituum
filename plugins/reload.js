export default {
    name: '@vituum/vite-plugin-reload',
    handleHotUpdate({ file, server }) {
        if (typeof server.config.vituum.reload === 'function' && server.config.vituum.reload(file)) {
            server.ws.send({
                type: 'full-reload',
                path: '*'
            })
        }
    }
}
