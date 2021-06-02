module.exports.show = (text) => {
  let date = new Date().toLocaleString();
  console.log(`[${date}]: ${text}`);
};
