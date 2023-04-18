import nodemailer from 'nodemailer';
import emailAuthConfig from '../config/email';
import oauth2Client from '../config/googleApi';

const sendEmail = async (
  recepientEmail: string,
  subject: string,
  mailBody: string
) => {
  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      ...emailAuthConfig,
      accessToken,
    },
  } as nodemailer.TransportOptions);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: recepientEmail,
    subject: subject,
    html: mailBody,
  });
};

export default sendEmail;
