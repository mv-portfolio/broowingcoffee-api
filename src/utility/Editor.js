module.exports = class {
  constructor() {}
  static getUsername(text) {
    let lastIndex = text.indexOf('@');
    return text.substring(0, lastIndex);
  }
};
