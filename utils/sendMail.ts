import ejs from "ejs";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const { data, email, subject, template } = options;

  const templatePath = path.join(__dirname, "../mails", template);

  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail
