#!/usr/bin/env node
import sendMail from './sendMail.js'
import { cleanupBeforeBuild, renameBeforeBuild, renameAfterBuild, cleanupAfterBuild, build } from './build.js'
import { execSync, vituumVersion as version } from '../utils/common.js'
import chalk from 'chalk'

const arg = process.argv[2]

const start = new Date()

if (arg === 'headless') {
    await build(true)
}

if (arg === 'build') {
    cleanupBeforeBuild()
    renameBeforeBuild()
    await build()
    execSync('mv public/views/* public && rm -rf public/views') // TODO
    renameAfterBuild()
    cleanupAfterBuild()
}

if (arg === 'cleanup') {
    cleanupBeforeBuild()
    cleanupAfterBuild()
}

if (arg === 'send-mail') {
    await sendMail()
}

console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green(`finished in ${chalk.grey(new Date() - start + 'ms')}`)}`)
