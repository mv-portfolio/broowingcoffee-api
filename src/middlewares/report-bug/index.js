const Nodemailer = new (require('../../utility/NodeMailer'))();
const Log = require('../../utility/Log');

module.exports = async (req, res) => {
  const {from, title, issue} = req.body;
  try {
    await Nodemailer.send({
      to: 'developer.petatemarvin26@gmail.com',
      subject: `BUG REPORT | ${title}`,
      text: `${issue}\n\nReported by: ${from}`,
    });

    Log.show(`/POST/bug-report SUCCESS`);
    res.status(200).json({
      status: true,
      res: 'Thank you for sending report, We will pay attention for that issue as soon as possible.',
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({status: false, err: err.message});
  }
};
