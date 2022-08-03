import nodemailer from 'nodemailer'
import chalk from 'chalk'
import path, { resolve } from 'path'
import fs from 'fs'

const vite = (await import(resolve(process.cwd(), 'vite.config.js'))).default
const template = vite.vituum.emails.send.template
const to = vite.vituum.emails.send.to

const transport = nodemailer.createTransport({
    host: process.env.VITUUM_SMTP_HOST,
    port: 465,
    auth: {
        user: process.env.VITUUM_SMTP_USER,
        pass: process.env.VITUUM_SMTP_PASS
    }
})

const file = path.join(process.cwd(), template)
const html = fs.readFileSync(file).toString()

transport.sendMail({
    from: vite.vituum.emails.send.from,
    to,
    subject: `${path.basename(process.cwd())} - ${path.basename(file)}`,
    html
}, (error, info) => {
    if (error) {
        return console.error(chalk.red(error))
    }

    console.log(chalk.blue('Message sent: %s', info.messageId))
})
