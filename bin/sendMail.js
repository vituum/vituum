import nodemailer from 'nodemailer'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

const sendMail = async(vite, version) => {
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

    await transport.sendMail({
        from: vite.vituum.emails.send.from,
        to,
        subject: `${path.basename(process.cwd())} - ${path.basename(file)}`,
        html
    }, (error, info) => {
        if (error) {
            return console.error(chalk.red(error))
        }

        console.info(`${chalk.cyan(`vituum v${version}`)} ${chalk.green('test email sent %s', info.messageId)}`)
    })
}

export default sendMail
