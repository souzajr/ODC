"use strict";

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
    }
})

module.exports = { 
    recoveryMail(email, token) {
        const mailOptions = {
            from: 'Base <' + process.env.MAIL_AUTH_USER + '>',
            to: email,
            subject: 'Recuperação de senha',
            html: 'Você está recebendo este Email pois solicitou a redefinição da senha da sua conta.<br/>' +
            'Por favor, clique no link abaixo ou cole no seu navegador para completar o processo:<br/><br/>' +
            process.env.DOMAIN_NAME + '/alterar-senha/' + token + '<br/><br/>' +
            'Se você não solicitou isso, ignore este Email e sua senha permanecerá inalterada.<br/>' +
            'Em caso de dúvidas, entre em contato através do Email '
        } 

        transporter.sendMail(mailOptions)
    },

    alertOfChange(email) {
        const mailOptions = {
            from: 'Base <' + process.env.MAIL_AUTH_USER + '>',
            to: email,
            subject: 'Alteração de senha',
            html: 'Uma alteração de senha acabou de ser feita no site ' + process.env.DOMAIN_NAME + '<br/><br/>' +
            'Se você não fez essa alteração, por favor entre em contato com o suporte.<br/>' +
            'Em caso de dúvidas, entre em contato através do Email '
        } 
        
        transporter.sendMail(mailOptions)
    },
}