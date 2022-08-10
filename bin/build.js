import chalk from 'chalk'
import FastGlob from 'fast-glob'
import { resolve } from 'path'
import { supportedFormats, vituumVersion as version } from '../utils/common.js'
import fs from 'fs'
import { resolveConfig, build as viteBuild } from 'vite'

const vite = await resolveConfig({}, 'build')
const config = vite.vituum

const build = async(headless = false) => {
    let inlineConfig = {}

    if (headless) {
        inlineConfig = {
            vituum: {
                build: {
                    headless: true
                }
            }
        }
    }

    await viteBuild(inlineConfig)
}

const renameBeforeBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('preparing for build...')}`)

    const viewsDir = resolve(vite.root, config.middleware.viewsDir)

    const files = FastGlob.sync([`${viewsDir}/**/*.{${supportedFormats.join(',')}}`, `!**/*.{${supportedFormats.join(',')}}.json`]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => {
        supportedFormats.forEach(format => {
            if (file.endsWith(`.${format}`)) {
                fs.renameSync(file, file.replace(`.${format}`, `.vituum.${format}.html`))

                if (config.build.log) {
                    const localPath = file.replace(process.cwd(), '')
                    console.info(chalk.blue(`..${localPath} -> ..${localPath.replace(`.${format}`, `.vituum.${format}.html`)}`))
                }
            }
        })
    })
}

const renameAfterBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('renaming templates after build...')}`)

    const files = FastGlob.sync([`${config.output}/**/*.html`]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => {
        supportedFormats.forEach(format => {
            if (file.includes(`.${format}.html`)) {
                fs.renameSync(file, file.replace(`.${format}.html`, '.html').replace('.vituum', ''))

                if (config.build.log) {
                    const localPath = file.replace(process.cwd(), '')
                    console.info(chalk.blue(`..${localPath} -> ..${localPath.replace(`.${format}.html`, '.html').replace('.vituum', '')}`))
                }
            }
        })
    })
}

const cleanupAfterBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('cleanup after build...')}`)

    const files = FastGlob.sync(['./playground/views/**/*.html']).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => {
        if (file.includes('.vituum')) {
            fs.renameSync(file, file.replace('.vituum', '').replace('.html', ''))
        }
    })
}

const cleanupBeforeBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('cleanup before build...')}`)

    const files = FastGlob.sync([`${config.output}/**/*.html`]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => fs.unlinkSync(file))

    fs.rmSync(`${config.output}/assets`, { recursive: true, force: true })
}

export { renameBeforeBuild, renameAfterBuild, cleanupAfterBuild, cleanupBeforeBuild, build }
