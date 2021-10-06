'use strict';

const fs = require(`fs`).promises;
const FILE_NAME = `mock.json`;
let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const content = await fs.readFile(FILE_NAME, `utf-8`);
    data = JSON.parse(content);
  } catch (err) {
    return (err);
  }

  return data;
};

module.exports = getMockData;
