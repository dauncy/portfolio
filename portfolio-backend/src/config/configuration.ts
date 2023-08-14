export default () => ({
  security: {
    general_api_key: process.env.VISITOR_APPI_KEY,
  },
  mailer: {
    smtpHost: process.env.MAIL_HOST,
    smtpUser: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
  },
});
