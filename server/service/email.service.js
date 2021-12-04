const mailer = require('nodemailer');

class EmailS{
    constructor(){
        this.transporter = mailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            tls: {rejectUnauthorized:false},
            auth:{
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
            
        })
    }

    async sendActivationMail(to, link){
        try {
          await this.transporter.sendMail({
                from:process.env.SMTP_EMAIL,
                to,
                subject:"Activate Email" + " " + process.env.API_URL,
                text:'Sup',
                html:
                `
                <div>
                    <h1>Для активации кликните по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
            })

            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new EmailS();