'use strict';

const version = require(`./version`);
const help = require(`./help`);
const filldb = require(`./filldb`);
const fill = require(`./fill`);
const server = require(`./server`);

module.exports = {
  [version.name]: version,
  [help.name]: help,
  [filldb.name]: filldb,
  [fill.name]: fill,
  [server.name]: server
};
