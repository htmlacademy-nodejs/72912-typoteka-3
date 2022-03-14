'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_POSTS_VALUE = 1;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MAX_POSTS = 1000;

const MAX_ID_LENGTH = 6;

const MAX_COMMENTS = 4;

const TEXT_LIMIT = 100;

const EXPIRATION = 480000;

const EXPIRATION_INTERVAL = 60000;

const MIN_ANNOUNCE_STRINGS = 1;

const MAX_ANNOUNCE_STRINGS = 3;

const MIN_COMMENT_STRINGS = 1;

const MAX_COMMENT_STRINGS = 3;

const MIN_PICTURE_NUMBER = 1;

const MAX_PICTURE_NUMBER = 16;

const ARTICLE_SCHEMA_ANNOUNCE_MIN = 30;

const ARTICLE_SCHEMA_ANNOUNCE_MAX = 250;

const ARTICLE_SCHEMA_FULL_TEXT = 1000;

const ARTICLE_SCHEMA_TITLE_MIN = 30;

const ARTICLE_SCHEMA_TITLE_MAX = 250;

const CATEGORY_SCHEMA_TEXT_MIN = 5;

const CATEGORY_SCHEMA_TEXT_MAX = 30;

const COMMENT_SCHEMA_TEXT_MIN = 20;

const API_PREFIX = `/api`;

const PATH_OF_CATEGORIES = `./data/categories.txt`;
const PATH_OF_SENTENCES = `./data/sentences.txt`;
const PATH_OF_TITLES = `./data/titles.txt`;
const PATH_OF_COMMENTS = `./data/comments.txt`;
const PATH_OF_API_LOG = `./logs/api.log`;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0
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

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ARTICLES_PER_PAGE = 8;

const CommentSchema = {
  TEXT_ERROR: `Комментарий содержит меньше 20 символов`,
  TEXT_EMPTY: `Сообщение не может быть пустым, напишите что-нибудь!`,
  USER_ID: `Пользователя с таким ID не существует`
};

const CategorySchema = {
  TEXT_MIN: `Название категории содержит меньше 5 символов`,
  TEXT_MAX: `Название категории не может содержать больше 30 символов`,
  TEXT_EMPTY: `Сообщение не может быть пустым, напишите что-нибудь!`,
};


const ArticleSchema = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержить больше 250 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  CATEGORIES: `Не выбрана ни одна категория публикации`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать больше 250 символов`,
  ANNOUNCE_NOT_EMPTY: `Анонс публикации не может быть пустым`,
  FULL_TEXT: `Описание публикации не должно превышать 1000 символов`,
  DATE: `Выбрана некорректная дата`,
  USER_ID: `Пользователя с таким ID не существует`
};

const UserSchema = {
  NAME: `Имя содержит некорректные символы`,
  SURNAME: `Фамилия содержит некорректные символы`,
  SURNAME_EMPTY: `Укажите фамилию`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXISTS: `Электронный адрес уже используется`,
  PASSWORD_MIN: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEAT: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`
};

const ErrorAuthMessage = {
  EMAIL: `Некорретный электронный адрес`,
  PASSWORD: `Неверный пароль`
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_POSTS_VALUE,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  MAX_POSTS,
  ExitCode,
  HttpCode,
  HttpMethod,
  PATH_OF_CATEGORIES,
  PATH_OF_SENTENCES,
  PATH_OF_TITLES,
  PATH_OF_COMMENTS,
  PATH_OF_API_LOG,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  TEXT_LIMIT,
  API_PREFIX,
  EXPIRATION,
  EXPIRATION_INTERVAL,
  MIN_ANNOUNCE_STRINGS,
  MAX_ANNOUNCE_STRINGS,
  MIN_COMMENT_STRINGS,
  MAX_COMMENT_STRINGS,
  MIN_PICTURE_NUMBER,
  MAX_PICTURE_NUMBER,
  ARTICLE_SCHEMA_ANNOUNCE_MIN,
  ARTICLE_SCHEMA_ANNOUNCE_MAX,
  ARTICLE_SCHEMA_FULL_TEXT,
  ARTICLE_SCHEMA_TITLE_MIN,
  ARTICLE_SCHEMA_TITLE_MAX,
  CATEGORY_SCHEMA_TEXT_MIN,
  CATEGORY_SCHEMA_TEXT_MAX,
  COMMENT_SCHEMA_TEXT_MIN,
  Env,
  ARTICLES_PER_PAGE,
  CommentSchema,
  ArticleSchema,
  UserSchema,
  CategorySchema,
  ErrorAuthMessage
};

