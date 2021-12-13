'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_POSTS_VALUE = 1;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MAX_POSTS = 1000;

const MAX_ID_LENGTH = 6;

const MAX_COMMENTS = 4;

const API_PREFIX = `/api`;

const PATH_OF_CATEGORIES = `./data/categories.txt`;
const PATH_OF_SENTENCES = `./data/sentences.txt`;
const PATH_OF_TITLES = `./data/titles.txt`;
const PATH_OF_COMMENTS = `./data/comments.txt`;
const PATH_OF_API_LOG = `./logs/api.log`;

const ExitCode = {
  error: 1,
  succes: 0
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ARTICLES_PER_PAGE = 8;

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
  PATH_OF_TITLES,
  PATH_OF_COMMENTS,
  PATH_OF_API_LOG,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  API_PREFIX,
  Env,
  ARTICLES_PER_PAGE
};

