import chalk from 'chalk'
import FastGlob from 'fast-glob'
import { resolve, relative, join } from 'path'
import { version } from '../utils/common.js'
import fs from 'fs'
import fse from 'fs-extra'
import { build as viteBuild, resolveConfig } from 'vite'

const vite = await resolveConfig({}, 'build')
const config = vite.vituum
const viewsDir = resolve(vite.root, config.middleware.viewsDir)
const supportedFormats = config.templates.formats

const build = async(headless = false) => {
    if (headless) {
        process.env.VITUUM_BUILD_MODE = 'headless'
    }

    await viteBuild()
}

const renameBeforeBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('preparing for build...')}`)

    const files = FastGlob.sync([`${viewsDir}/**/*.{${supportedFormats.join(',')}}`.replace(/\\/g, '/'), `!**/*.{${supportedFormats.join(',')}}.json`]).map(entry => resolve(process.cwd(), entry))

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

    const files = FastGlob.sync([`${config.output}/**/*.html`.replace(/\\/g, '/')]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => {
        supportedFormats.forEach(format => {
            if (file.includes(`.json.${format}.html`) || file.includes(`.json.vituum.${format}.html`)) {
                fs.renameSync(file, file.replace(`.${format}.html`, '').replace('.vituum', ''))

                if (config.build.log) {
                    const localPath = file.replace(process.cwd(), '')
                    console.info(chalk.blue(`..${localPath} -> ..${localPath.replace(`.${format}.html`, '').replace('.vituum', '')}`))
                }
            } else if (file.includes(`.${format}.html`)) {
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

    const files = FastGlob.sync([`${viewsDir}/**/*.html`.replace(/\\/g, '/')]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => {
        if (file.includes('.vituum')) {
            fs.renameSync(file, file.replace('.vituum', '').replace('.html', ''))
        }
    })
}

const cleanupBeforeBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('cleanup before build...')}`)

    const files = FastGlob.sync([`${config.output}/**/*.html`.replace(/\\/g, '/')]).map(entry => resolve(process.cwd(), entry))

    files.forEach(file => fs.unlinkSync(file))

    fs.rmSync(`${config.output}/assets`, { recursive: true, force: true })
}

const moveFiles = async() => {
    const viewsDir = relative(config.root, config.middleware.viewsDir)
    const outputViews = FastGlob.sync(resolve(process.cwd(), `${join(config.output, viewsDir)}/**`).replace(/\\/g, '/')).map(entry => resolve(process.cwd(), entry))
    const movedViews = outputViews.map(path => {
        return path.replace(resolve(process.cwd(), join(config.output, viewsDir)), resolve(process.cwd(), config.output))
    })

    await Promise.all(outputViews.map((file, i) =>
        fse.move(file, movedViews[i])
    ))

    await fse.remove(join(config.output, viewsDir))
}

export { renameBeforeBuild, renameAfterBuild, cleanupAfterBuild, cleanupBeforeBuild, moveFiles, build }
