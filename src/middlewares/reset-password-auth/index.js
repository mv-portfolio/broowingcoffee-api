module.exports = (req, res) => {
  const {email, token} = res.locals;
  res.status(200).json({status: true, res: {email, token}});
};
