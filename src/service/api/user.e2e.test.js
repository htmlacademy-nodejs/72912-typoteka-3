'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);

const user = require(`./user`);

const UserService = require(`../data-service/user`);
const {HttpCode} = require(`../../constans`);

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

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB));

  return app;
};


describe(`API creates user if data is valid`, () => {
  const validUserData = {
    email: `ivanov2@example.com`,
    password: `qwert1234`,
    passwordRepeated: `qwert1234`,
    name: `Иван`,
    surname: `Иванов`,
    avatar: `avatar1.jpg`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});


describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    email: `ivanov2@example.com`,
    password: `qwert1234`,
    passwordRepeated: `qwert1234`,
    name: `Иван`,
    surname: `Иванов`,
    avatar: `avatar1.jpg`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When email is exist`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When password and passwordRepeated are not equal`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `123`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Without any required property`, async () => {
    const userData = {
      email: `ivanov2@example.com`,
      password: `qwert1234`,
      passwordRepeated: `qwert1234`,
      name: `Иван`,
      surname: `Иванов`,
    };

    for (const key of Object.keys(userData)) {
      const badUserData = {...userData};
      delete badUserData[key];

      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });


  test(`When field value is wrong responce code`, async () => {
    const badUserData = [
      {...validUserData, password: `123`, passwordRepeated: `123`},
      {...validUserData, email: `ivalid`},
    ];

    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});
