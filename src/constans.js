'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_POSTS_VALUE = 1;

const USER_ARGV_INDEX = 2;

const MAX_POSTS = 1000;

const FIRST_POST_MONTH = 3;

const ExitCode = {
  error: 1,
  succes: 0
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_POSTS_VALUE,
  USER_ARGV_INDEX,
  MAX_POSTS,
  FIRST_POST_MONTH,
  ExitCode
};

