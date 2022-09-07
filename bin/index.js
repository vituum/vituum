#!/usr/bin/env node
import { cleanupBeforeBuild, renameBeforeBuild, renameAfterBuild, cleanupAfterBuild, moveFiles, build } from './build.js'
import { version } from '../utils/common.js'
import chalk from 'chalk'
import { resolveConfig } from 'vite'

const vite = await resolveConfig({}, 'build')
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
    await moveFiles()
    renameAfterBuild()
    cleanupAfterBuild()
}

if (arg === 'cleanup') {
    cleanupBeforeBuild()
    cleanupAfterBuild()
}

if (integration) {
    await integration.task.action()
}

console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green(`finished in ${chalk.grey(new Date() - start + 'ms')}`)}`)
