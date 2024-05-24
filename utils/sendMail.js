const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config({path:"config.env"});


const user_email= process.env.user_email;
const user_password= process.env.user_password;


const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:465,
    secure:true,   // It means you are telling nodemailer to use a secure SSL/TLS connection. This ensures that all data sent is encrypted.
    auth:{
      user:user_email,
      pass:user_password
    }
  })
  
  async function sendEmail(userEmail,subject,htmlTemplate){
    try{
  
      const mailOption = {
        to:userEmail,
        subject:subject,
        html:htmlTemplate
      }
  
      const info = await transporter.sendMail(mailOption)
  
    }
  
    catch(error){
      throw new Error("internal server error (nodemailer)")
    }
  }
  




  // const sendEmail = async (options) => { // parameter accept opject as argument or ...option
  
  //   const mailOptions = {
  //     from: `<${process.env.EMAIL_USER}>`,
  //     to: options.email,
  //     subject: options.subject,
  //     text: options.message,
  //   };
  //   await transporter.sendMail(mailOptions);
  // };






  





module.exports = {
    sendEmail
}