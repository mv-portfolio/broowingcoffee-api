const toFormatName = (name) => {
  const names = name.split(" ");
  let tempName = "";
  names.forEach((name, index) => {
    tempName +=
      name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    if (index + 1 !== names.length) tempName += " ";
  });
  return tempName;
};
const toFormatMoney = (number) => {
  return parseFloat(number).toFixed(2);
};
const toFormatNumber = (num) => {
  if (num < 10) {
    return "0" + num;
  }
  return num;
};
const toFormatTime = (date) => {
  const tempDate = date ? new Date(date) : new Date();
  const hours = toFormatNumber(
    tempDate.getHours() ? tempDate.getHours() % 12 : 12
  );
  const minutes = toFormatNumber(tempDate.getUTCMinutes());
  const seconds = toFormatNumber(tempDate.getSeconds());
  const meridian = tempDate.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes}:${seconds} ${meridian}`;
};
const toFormatDate = (date) => {
  const tempDate = new Date(date);
  const month = tempDate.getMonth() + 1;
  const dateNum = tempDate.getDate();
  const year = tempDate.getFullYear();
  return `${month}/${dateNum}/${year}`;
};
const toFormatDateTime = (date) => {
  return `${toFormatDate(date)} - ${toFormatTime(date)}`;
};
const getTimeDifference = (prevDate) => {
  const prevTime = new Date(prevDate).getTime();
  const currTime = new Date().getTime();
  const timeDifference = Math.floor((currTime - prevTime) / 1000);

  //exact
  if (timeDifference === 0) {
    return "Now";
  }
  //seconds
  if (timeDifference < 60) {
    return `${timeDifference} second${timeDifference > 1 ? "s" : ""} ago`;
  }
  //minutes
  if (timeDifference < 60 * 60) {
    const minute = Math.floor(timeDifference / 60);
    if (minute < 60) {
      return `${minute} minute${minute > 1 ? "s" : ""} ago`;
    }
  }
  //hour
  if (timeDifference < 60 * 60 * 60) {
    const hour = Math.floor(timeDifference / (60 * 60));
    if (hour < 24) {
      return `${hour} hour${hour > 1 ? "s" : ""} ago`;
    }
  }
  //day
  if (timeDifference < 60 * 60 * 60 * 24) {
    const day = Math.floor(timeDifference / (60 * 60 * 24));
    if (day <= 1) {
      return "Yesterday";
    }
    return `${toFormatDate(prevTime)} - ${toFormatTime(prevTime)}`;
  }
  return `${toFormatDate(prevTime)} - ${toFormatTime(prevTime)}`;
};

const dayTerm = (date) => {
  let day;
  if (date.getDay() === 0) {
    day = "Sunday";
  } else if (date.getDay() === 1) {
    day = "Monday";
  } else if (date.getDay() === 2) {
    day = "Tuesday";
  } else if (date.getDay() === 3) {
    day = "Wednesday";
  } else if (date.getDay() === 4) {
    day = "Thursday";
  } else if (date.getDay() === 5) {
    day = "Friday";
  } else if (date.getDay() === 6) {
    day = "Saturday";
  }
  return day;
};
const monthTerm = (date) => {
  let month;
  if (date.getMonth() === 0) {
    month = "January";
  } else if (date.getMonth() === 1) {
    month = "February";
  } else if (date.getMonth() === 2) {
    month = "March";
  } else if (date.getMonth() === 3) {
    month = "April";
  } else if (date.getMonth() === 4) {
    month = "May";
  } else if (date.getMonth() === 5) {
    month = "June";
  } else if (date.getMonth() === 6) {
    month = "July";
  } else if (date.getMonth() === 7) {
    month = "August";
  } else if (date.getMonth() === 8) {
    month = "September";
  } else if (date.getMonth() === 9) {
    month = "October";
  } else if (date.getMonth() === 10) {
    month = "November";
  } else if (date.getMonth() === 11) {
    month = "December";
  }
  return month;
};

module.exports = {
  toFormatName,
  toFormatDate,
  toFormatMoney,
  toFormatNumber,
  toFormatTime,
  toFormatDate,
  toFormatDateTime,
  getTimeDifference,
  dayTerm,
  monthTerm,
};
