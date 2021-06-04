const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

module.exports = {
  pool: true,
  host: 'http://localhost:52619',
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
