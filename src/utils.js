'use strict';

const {FIRST_POST_MONTH} = require(`./constans`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i]
    ];
  }

  return someArray;
};

const getRandomTime = () => {
  let hours = getRandomInt(0, 24);
  let minutes = getRandomInt(0, 59);
  let seconds = getRandomInt(0, 59);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
};

const getRandomDate = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  let randomMonth = (getRandomInt(new Date().getMonth() - FIRST_POST_MONTH, new Date().getMonth())) + 1;
  let randomDay = getRandomInt(1, new Date(new Date().getFullYear(), randomMonth, 0).getDate());

  if (randomMonth === currentMonth) {

    if (randomDay > new Date().getDate()) {

      randomDay = new Date().getDate();
    }
  }

  randomDay = randomDay < 10 ? `0${randomDay}` : randomDay;
  randomMonth = randomMonth < 10 ? `0${randomMonth}` : randomMonth;


  return `${currentYear}-${randomMonth}-${randomDay} ${getRandomTime()}`;
};


module.exports = {
  getRandomInt,
  shuffle,
  getRandomTime,
  getRandomDate
};
