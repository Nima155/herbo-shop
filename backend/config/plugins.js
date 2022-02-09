module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: process.env.SMTP_SERVER,
        port: 587,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_SECRET,
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: process.env.SMTP_EMAIL,
        defaultReplyTo: process.env.SMTP_EMAIL,
      },
    },
  },

  // ...
});
