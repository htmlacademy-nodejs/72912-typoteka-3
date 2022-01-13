'use strict';

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

const getRandomDate = () => {

  const dateNow = new Date();
  const dateOld = new Date().setMonth(new Date().getMonth() - 3);
  const randomDate = new Date(getRandomInt(dateOld, +dateNow));

  return randomDate.toLocaleString();
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate,
  ensureArray,
  prepareErrors
};
