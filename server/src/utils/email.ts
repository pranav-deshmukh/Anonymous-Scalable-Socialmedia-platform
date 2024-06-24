import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


interface Ioptions{
    email:string,
    subject:string,
    message:string,
}

export const sendMail = async(options:Ioptions)=>{
    try {
        const transporterOptions:SMTPTransport.Options = {
            host:process.env.EMAIL_HOST,
            port:Number(process.env.EMAIL_PORT),
            secure:false,
            auth:{
                user:process.env.EMAIL_USERNAME!,
                pass: process.env.EMAIL_PASSWORD!,
            },
        };
        
        const transporter = nodemailer.createTransport(transporterOptions);

        const mailOptions={
            from:"admin@gmail.com",
            to:options.email,
            subject:options.subject,
            text:options.message,
        }
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully`);
    } catch (error) {
        console.log('Error in sending mail: ',error);
    }
} 