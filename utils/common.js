import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import pc from 'picocolors'

export const getPackageInfo = (path) => JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(path))), 'package.json')).toString())

export const pluginError = (render, server) => {
    if (render.error) {
        if (!server) {
            console.error(pc.red(render.error))
            return true
        }

        setTimeout(() => server.ws.send({
            type: 'error',
            err: {
                message: render.error.message,
                plugin: name
            }
        }), 50)

        return true
    }
}

export const pluginReload = ({ file, server }, options) => {
    if (
        (typeof options.reload === 'function' && options.reload(file)) ||
        (typeof options.reload === 'boolean' && options.reload && (options.filetypes.html.test(file) || options.filetypes.json.test(file)))
    ) {
        server.ws.send({ type: 'full-reload' })
    }
}
