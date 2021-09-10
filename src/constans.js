'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_POSTS_VALUE = 1;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MAX_POSTS = 1000;

const PATH_OF_CATEGORIES = `./data/categories.txt`;
const PATH_OF_SENTENCES = `./data/sentences.txt`;
const PATH_OF_TITLES = `./data/titles.txt`;

const ExitCode = {
  error: 1,
  succes: 0
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_POSTS_VALUE,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  MAX_POSTS,
  ExitCode,
  HttpCode,
  PATH_OF_CATEGORIES,
  PATH_OF_SENTENCES,
  PATH_OF_TITLES
};

