import childProcess from 'child_process'
import fs from 'fs'
import lodash from 'lodash'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const execSync = (cmd) => {
    try {
        childProcess.execSync(cmd, { stdio: [0, 1, 2] })
    } catch {
        process.exit(1)
    }
}

const { version } = JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(import.meta.url))), '../package.json')).toString())

const merge = (object, sources) => lodash.mergeWith(object, sources, (a, b) => lodash.isArray(b) ? b : undefined)

export { execSync, version, merge }
