'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);

const articles = require(`./articles`);
const ArticleService = require(`../data-service/articles`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constans`);

const mockArticles = [
  {
    "title": `Продам новую приставку Sony Playstation 5`,
    "announce": `Анонс`,
    "fullText": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "categories": [`Журналы`],
    "createdAt": `12-01-2022`,
    "user": `ivanov@example.com`,
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
    "createdAt": `11-01-2022`,
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
    "createdAt": `14-01-2022`,
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
  articles(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};


describe(`API returns a list of all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/?comments=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(3));

  test(`First article's id equals 3`, () => expect(response.body[0].id).toBe(3));

});

describe(`API returns as article with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Articles title is "Продам новую приставку Sony Playstation 5"`, () => expect(response.body.title).toBe(`Продам новую приставку Sony Playstation 5`));
});

describe(`API creates an article if data is valid`, () => {
  let newArticle;
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    newArticle = {
      title: `Котики Javascript любят все программисты мира`,
      categories: [1, 2],
      announce: `Супер кот Javascript любят все программисты мира`,
      fullText: `Javascript любят все программисты мира Javascript любят все программисты мираJavascript любят все программисты мираJavascript любят все программисты мира`,
      date: `2021-01-05 19:50:04`,
      userId: 1
    };

    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining({
    announce: `Супер кот Javascript любят все программисты мира`,
  })));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  let app;
  let newArticle;

  beforeAll(async () => {
    app = await createAPI();
    newArticle = {
      title: `Котики`,
      categories: [1, 2],
      announce: `Супер кот`,
      fullText: `Javascript любят все программисты мира`,
      userId: 9,
    };
  });

  test(`Without any required property response code is 400`, async () => {
    const badArticle = {...newArticle};

    for (const key of Object.keys(newArticle)) {
      delete badArticle[key];

      return await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }

    return null;
  });

  test(`When field type is wrong response code is 400`, async () => {
    const oldArticle = {
      title: `Котики Javascript любят все программисты мира`,
      categories: [1, 2],
      announce: `Супер кот Javascript любят все программисты мира`,
      fullText: `Javascript любят все программисты мира Javascript любят все программисты мираJavascript любят все программисты мираJavascript любят все программисты мира`,
      date: `2021-01-05 19:50:04`,
    };

    const badArticles = [
      {...oldArticle, title: `Короткий заголовок`},
      {...oldArticle, categories: []},
      {...oldArticle, announce: `Короткий анонс`},
    ];

    for (const badArticle of badArticles) {
      return await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }

    return null;
  });

  test(`When field value is wrong response code is 400`, async () => {
    const oldArticle = {
      title: `Котики Javascript любят все программисты мира`,
      categories: [1, 2],
      announce: `Супер кот Javascript любят все программисты мира`,
      fullText: `Javascript любят все программисты мира Javascript любят все программисты мираJavascript любят все программисты мираJavascript любят все программисты мира`,
      date: `2021-01-05 19:50:04`,
    };

    const badArticles = [
      {...oldArticle, title: -1},
      {...oldArticle, categories: {}},
      {...oldArticle, date: `text`},
    ];

    for (const badArticle of badArticles) {
      return await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }

    return null;
  });

});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Котики Javascript любят все программисты мира`,
    categories: [1, 2],
    announce: `Супер кот Javascript любят все программисты мира`,
    fullText: `Javascript любят все программисты мира Javascript любят все программисты мираJavascript любят все программисты мираJavascript любят все программисты мира`,
    date: `2021-01-05 19:50:04`,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toBe(true));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Котики Javascript любят все программисты мира`))
  );

});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));

  test(`Article count is 2 now`, async () => {
    const articleResponse = await request(app).get(`/articles`);
    expect(articleResponse.body.length).toBe(2);
  });

  test(`API refuses to delete non-existent article`, () => {

    return request(app)
      .delete(`/articles/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`UPDATE: API`, () => {
  let app;
  let validArticle;

  beforeAll(async () => {
    app = await createAPI();
    validArticle = {
      title: `Котики`,
      createdAt: `10-10-2021`,
      announce: `Супер кот`,
      fullText: `Супер кот, который умеет верстать!`,
      category: [`Животные`, `Игры`],
      userId: 1
    };
  });

  test(`API returns status code 404 when trying to change non-existent article`, () => {
    return request(app)
      .put(`/articles/NOEXST`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

    const invalidArticle = {...validArticle};

    delete invalidArticle.title;

    await request(app)
      .put(`/articles/1`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API change comments`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

    return request(app)
      .post(`/articles/NOEXST/comments`)
      .send({
        text: `Неважно`
      })
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API refuses to delete non-existent comment`, () => {

    return request(app)
      .delete(`/articles/1/comments/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });
});

