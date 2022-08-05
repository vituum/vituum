#!/usr/bin/env node
import childProcess from 'child_process'
import FastGlob from 'fast-glob'
import { resolve } from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { supportedFormats } from '../utils/common.js'
import sendMail from './sendMail.js'

const { version } = JSON.parse(fs.readFileSync('./package.json').toString())
const vite = (await import(resolve(process.cwd(), 'vite.config.js'))).default
const arg = process.argv[2]
const config = vite.vituum

const execSync = (cmd) => {
    try {
        childProcess.execSync(cmd, { stdio: [0, 1, 2] })
    } catch {
        process.exit(1)
    }
}

const renameBeforeBuild = () => {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('preparing for build...')}`)

    const files = FastGlob.sync(['./playground/views/**/*.{latte,json}']).map(entry => resolve(process.cwd(), entry))

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

if (arg === 'build') {
    cleanupBeforeBuild()
    renameBeforeBuild()
    execSync('vite build')
    execSync('mv public/views/* public && rm -rf public/views') // TODO
    renameAfterBuild()
    cleanupAfterBuild()
}

if (arg === 'send-mail') {
    console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('sending test email...')}`)

    await sendMail(vite, version)
}
