'use strict';

const {TEXT_LIMIT} = require(`./constans`);

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

const adapterText = (arr, key, limit) => {
  return arr.map((item) => ({
    ...item,
    [key]: item[key].length > TEXT_LIMIT ? item[key].slice(0, limit).trim().concat(`...`) : item[key]
  }));
};

const getAndSortComments = (articles) => {
  const comments = articles.map((item) => {
    return item.comments;
  })
  .reduce((acc, val) => acc.concat(val), [])
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return comments;
};

const convertDate = (dateString, onlyDate) => {
  const date = new Date(dateString);
  let format;
  if (onlyDate) {
    format = date.toLocaleString(`ru-RU`, {year: `numeric`, month: `numeric`, day: `numeric`});
  } else {
    format = date.toLocaleString(`ru-RU`, {year: `numeric`, month: `numeric`, day: `numeric`, hour: `2-digit`, minute: `2-digit`});
  }

  return format;
};

const adapterComment = (comment) => {

  const adaptedComment = {
    'id': comment.id,
    'articleId': comment.articleId,
    'text': comment.text.length > TEXT_LIMIT ? comment.text.slice(0, TEXT_LIMIT).trim().concat(`...`) : comment.text,
    'avatar': comment.users.avatar,
    'name': comment.users.name,
    'surname': comment.users.surname
  };

  return adaptedComment;
};

const getCategories = (categories) => {
  if (Array.isArray(categories)) {
    return categories;
  }

  if (typeof categories === `string`) {
    return [categories];
  }

  return [];
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate,
  ensureArray,
  prepareErrors,
  adapterText,
  adapterComment,
  getAndSortComments,
  convertDate,
  getCategories
};
