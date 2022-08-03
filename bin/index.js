import childProcess from 'child_process'

const arg = process.argv[2]

const execSync = (cmd) => {
    try {
        childProcess.execSync(cmd, { stdio: [0, 1, 2] })
    } catch {
        process.exit(1)
    }
}

if (arg === 'build') {
    execSync('vite build')
    execSync('mv public/views/* public && rm -rf public/views') // TODO
}
