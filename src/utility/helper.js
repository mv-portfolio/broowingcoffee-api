const arrayFind = (data = [], callback) => {
  return data.filter(callback).length !== 0;
};


module.exports = {
  arrayFind,
};
