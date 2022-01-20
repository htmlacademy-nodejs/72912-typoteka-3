'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);

const {HttpCode} = require(`../../constans`);

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];

const mockArticles = [
  {
    "title": `Продам новую приставку Sony Playstation 5`,
    "announce": `Анонс`,
    "fullText": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "categories": [`Журналы`],
    "comments": [
      {
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`,
        "user": `petrov@example.com`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`,
        "user": `myemail@test.com`
      },
      {
        "text": `Неплохо, но дорого. Совсем немного...`,
        "user": `petrov@example.com`
      },
      {
        "text": `Вы что?! В магазине дешевле.`,
        "user": `myemail@test.com`
      }
    ],
  },
  {
    "title": `Куплю слона`,
    "announce": `Анонс`,
    "fullText": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "categories": [`Игры`],
    "comments": [
      {
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`,
        "user": `petrov@example.com`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`,
        "user": `myemail@test.com`
      },
      {
        "text": `Неплохо, но дорого. Совсем немного...`,
        "user": `petrov@example.com`
      },
      {
        "text": `Вы что?! В магазине дешевле.`,
        "user": `myemail@test.com`
      }
    ],
  },
  {
    "title": `200 совет для улучшения здоровья`,
    "announce": `Анонс`,
    "fullText": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "categories": [`Животные`],
    "comments": [
      {
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`,
        "user": `petrov@example.com`
      },
      {
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`,
        "user": `myemail@test.com`
      },
      {
        "text": `Неплохо, но дорого. Совсем немного...`,
        "user": `petrov@example.com`
      },
      {
        "text": `Вы что?! В магазине дешевле.`,
        "user": `myemail@test.com`
      }
    ],
  }
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `qwert1234`,
    name: `Иван`,
    surname: `Иванов`,
    avatar: `avatar1.jpg`
  }, {
    email: `petrov@example.com`,
    passwordHash: `artbook99`,
    name: `Пётр`,
    surname: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const mockDB = new Sequelize(`sqlite::memory`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(app, new CategoryService(mockDB));
});

describe(`Api return category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));

  test(`Category names are "Журналы", "Игры", "Животные"`, () => {
    expect(response.body.map((it) => it.name)).toEqual(expect.arrayContaining(mockCategories));
  });
});
