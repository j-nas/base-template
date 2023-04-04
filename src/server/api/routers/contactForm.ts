import { createTRPCRouter, publicProcedure } from "../trpc";
import { contactFormValidationSchema } from "../../../utils/validationSchema";
import { env } from "../../../env/server.mjs";
import nodemailer from "nodemailer";

export const contactFormRouter = createTRPCRouter({
  sendContactForm: publicProcedure
    .input(contactFormValidationSchema)
    .mutation(async ({ input }) => {
      const transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT,
        secure: true,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `${env.EMAIL_FROM} <${env.EMAIL_USER}>`,
        to: env.EMAIL_TO,
        subject: `New message from contact form at ${env.EMAIL_FROM}`,
        text: `Email: ${input.email}\nPhone: ${input.phone}\nMessage: ${input.message}`,

      };

      try {
        await transporter.sendMail(mailOptions);
        return mailOptions;
      }
      catch (error) {
        console.log(error);
        throw new Error("Error sending email");
      }
      finally {
        transporter.close();
      }
    })
});

