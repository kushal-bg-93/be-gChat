const nodemailer=require('nodemailer')
const sendEmail=async(sub,body,to,cc,attachments)=>{
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      const mailOptions = {
        from: "Tasko! Task Management",
        to: to,
        cc:cc,
        subject: sub,
        html: body,
        attachments: attachments,
      }
      let emailTransport = await transporter.sendMail(mailOptions);
    // console.log(emailTransport,"<<<<<<<<<<<<<<<<<")
    return emailTransport;
    } catch (error) {
      console.log(error)
      Promise.reject(error)
    }
  }

  module.exports=sendEmail