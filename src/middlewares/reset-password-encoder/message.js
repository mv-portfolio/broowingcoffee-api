const {SENDER_EMAIL} = process.env;

module.exports = ({to, subject, text, html}) => ({
  from: SENDER_EMAIL,
  to,
  subject,
  text,
  html,
});
