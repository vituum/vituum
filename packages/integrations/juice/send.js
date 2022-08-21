import nodemailer from 'nodemailer'
import chalk from 'chalk'
import path, { dirname, resolve } from 'path'
import fs from 'fs'
import { config as dotenv } from 'dotenv'
import { fileURLToPath } from 'url'

dotenv()

const { version, name } = JSON.parse(fs.readFileSync(resolve(dirname((fileURLToPath(import.meta.url))), 'package.json')).toString())

const send = async(userConfig = {}) => {
    const template = userConfig.send.template
    const to = userConfig.send.to

    console.info(`${chalk.cyan(`${name} v${version}`)} ${chalk.green('sending test email...')}`)

    if (!template) {
        console.info(`${chalk.cyan(`${name} v${version}`)} ${chalk.red('email template not defined')}`)
    }

    if (!to) {
        console.info(`${chalk.cyan(`${name} v${version}`)} ${chalk.red('email to not defined')}`)
    }

    if (!template || !to) {
        process.exit(1)
    }

    const transport = nodemailer.createTransport({
        host: process.env.VITUUM_SMTP_HOST || userConfig.send.host,
        port: 465,
        auth: {
            user: process.env.VITUUM_SMTP_USER || userConfig.send.user,
            pass: process.env.VITUUM_SMTP_PASS || userConfig.send.pass
        }
    })

    const file = path.join(process.cwd(), template)

    if (!fs.existsSync(file)) {
        console.info(`${chalk.cyan(`${name} v${version}`)} ${chalk.red('email template not found')} ${chalk.gray(file)}`)
        process.exit(1)
    }

    const html = fs.readFileSync(file).toString()

    await transport.sendMail({
        from: userConfig.send.from,
        to,
        subject: `${path.basename(process.cwd())} - ${path.basename(file)}`,
        html
    }, (error, info) => {
        if (error) {
            return console.error(chalk.red(error))
        }

        console.info(`${chalk.cyan(`${name} v${version}`)} ${chalk.green('test email sent')} ${chalk.gray(info.messageId)}`)
    })
}

export default send
