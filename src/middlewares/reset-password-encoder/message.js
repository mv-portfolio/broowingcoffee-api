const Editor = require('../../utility/Editor');

const {SENDER_EMAIL, DOMAIN} = process.env;

module.exports = (to, subject, token, html) => ({
  from: SENDER_EMAIL,
  to: to,
  subject: subject,
  text: `Hello ${Editor.getUsername(to)},
  \n\nYou are requesting for password reset, if you wish to performed this action, please click the link bellow.\n\n\n${DOMAIN}/reset-password/${token}\n\n\nIf you are not requesting for password reset, you can safety ignore this email.`,
  html: html,
});
