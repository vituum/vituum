import childProcess from 'child_process'
import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const execSync = (cmd) => {
    try {
        childProcess.execSync(cmd, { stdio: [0, 1, 2] })
    } catch {
        process.exit(1)
    }
}

const vituumVersion = JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(import.meta.url))), '../package.json')).toString()).version

export { execSync, vituumVersion }
