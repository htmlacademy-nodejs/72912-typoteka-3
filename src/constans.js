'use strict';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_POSTS_VALUE = 1;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MAX_POSTS = 1000;

const MAX_ID_LENGTH = 6;

const MAX_COMMENTS = 4;

const TEXT_LIMIT = 100;

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
  Env,
  ARTICLES_PER_PAGE,
  CommentSchema,
  ArticleSchema,
  UserSchema,
  CategorySchema,
  ErrorAuthMessage
};

