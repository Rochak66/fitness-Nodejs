
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host:"sandbox.smtp.mailtrap.io",
  port:2525,
  auth: {
    user: process.env.MY_GMAIL, //  email address
    pass: process.env.MY_PASSWORD, //email password
  },
});

const sendEmail = async(receiver)=>{
  try{
    await transport.sendMail(receiver);
    console.log("emailsent",receiver)
  } catch(error){
    throw new Error("error sending  email")
  }
};

module.exports = { sendEmail };
