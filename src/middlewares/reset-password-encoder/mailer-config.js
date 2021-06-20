const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

module.exports = {
  pool: true,
  host: 'smtp.gmail.com',
  service: 'gmail',
  port: 526,
  secure: true, // use TLS
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
