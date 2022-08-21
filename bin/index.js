#!/usr/bin/env node
import send from './send.js'
import { cleanupBeforeBuild, renameBeforeBuild, renameAfterBuild, cleanupAfterBuild, build } from './build.js'
import { execSync, vituumVersion as version } from '../utils/common.js'
import chalk from 'chalk'
import { resolve } from 'path'
const vite = (await import(resolve(process.cwd(), 'vite.config.js'))).default
const config = vite.vituum

const arg = process.argv[2]
const start = new Date()
const integration = config.integrations.filter((integration) => integration.task?.name === arg)[0]

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

if (arg === 'send') {
    await send()
}

if (integration) {
    integration.task.action()
}

console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green(`finished in ${chalk.grey(new Date() - start + 'ms')}`)}`)
