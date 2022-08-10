#!/usr/bin/env node
import sendMail from './sendMail.js'
import { cleanupBeforeBuild, renameBeforeBuild, renameAfterBuild, cleanupAfterBuild } from './build.js'
import { execSync } from '../utils/common.js'

const arg = process.argv[2]

if (arg === 'production') {
    execSync('vite build')
}

if (arg === 'build') {
    cleanupBeforeBuild()
    renameBeforeBuild()
    execSync('vite build')
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
