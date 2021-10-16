const isTypeof = (type, value1, value2) => {
  if (type === 'array') {
    return Array.isArray(value1) ? value1 : value2;
  }
  return typeof value1 === type ? value1 : value2;
};
const isName = val => {
  return /^[a-zA-Z ]*$/.test(val);
};
const isInteger = val => {
  return /^[0-9]*$/.test(val);
};
const isDouble = val => {
  return /^\$?\d+(,\d{3})*(\.\d*)?$/.test(val);
};
const isUsername = val => {
  return /^[a-zA-Z0-9]*$/.test(val);
};
const isEmail = val => {
  return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
    val,
  );
};
const isPassword = (val, length) => {
  return (
    hasUpperCaseLetter(val) &&
    hasLowerCaseLetter(val) &&
    hasNumber(val) &&
    val.length >= (length || 6)
  );
};
const hasUpperCaseLetter = val => {
  return /(?=.*([A-Z]))/.test(val);
};
const hasLowerCaseLetter = val => {
  return /(?=.*([a-z]))/.test(val);
};
const hasLetter = val => {
  return /(?=.*([a-zA-Z]))/.test(val);
};
const hasNumber = val => {
  return /(?=.*[0-9])/.test(val);
};
const hasSymbol = val => {
  return /(?=.*[!@#$%^&*()_=+-/])/.test(val);
};

const isString = value => {
  return typeof value === 'string';
};
const isArray = value => {
  return Array.isArray(value);
};
const isObject = value => {
  return typeof value === 'object';
};

const isJsonString = value => {
  try {
    const isObject =
      value.slice(0, 1) === '{' && value.slice(value.length - 1) === '}';
    if (typeof value === 'string' && isObject) {
      JSON.parse(value);
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
};

module.exports = {
  isTypeof,
  isName,
  isInteger,
  isDouble,
  hasNumber,
  hasLetter,
  isEmail,
  isUsername,
  isPassword,
  isString,
  isJsonString,
  isArray,
  isObject,
  hasSymbol,
  hasUpperCaseLetter,
  hasLowerCaseLetter,
};
