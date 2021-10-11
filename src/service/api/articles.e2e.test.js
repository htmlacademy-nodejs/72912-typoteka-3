'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constans`);
const articles = require(`./articles`);
const ArticleService = require(`../data-service/articles`);
const CommentService = require(`../data-service/comment`);

const mockData = [
  {
    "id": `Fg0ikD`,
    "user": `ivanov@example.com`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
      }
    ],
    "description": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `SALE`,
    "sum": 79555
  },
  {
    "id": `E7qAM5`,
    "user": `petrov@example.com`,
    "category": [
      `Игры`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле.`
      }
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item02.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 55460
  },
  {
    "id": `lVQQlp`,
    "user": `ivanov@example.com`,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Даю недельную гарантию. Продаю с болью в сердце... Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 81801
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticleService(cloneData), new CommentService(cloneData));
  return app;
};


describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(3));

  test(`First article's id quals "Fg0ikD"`, () => expect(response.body[0].id).toBe(`Fg0ikD`));

});

describe(`API returns as article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/Fg0ikD`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Articles title is "Продам новую приставку Sony Playstation 5"`, () => expect(response.body.title).toBe(`Продам новую приставку Sony Playstation 5`));
});


describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Котики`,
    createDate: `10-10-2021`,
    category: [`Животные`, `Игры`],
    announce: `Супер кот`,
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Котики`,
    createDate: `10-10-2021`,
    announce: `Супер кот`,
    category: [`Животные`, `Игры`],
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});


describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Котики`,
    createDate: `10-10-2021`,
    announce: `Супер кот`,
    fullText: `Супер кот, который умеет верстать!`,
    category: [`Животные`, `Игры`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/Fg0ikD`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/Fg0ikD`)
    .expect((res) => expect(res.body.title).toBe(`Котики`))
  );

});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/Fg0ikD`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted articles`, () => expect(response.body.id).toBe(`Fg0ikD`));

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

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Котики`,
    createDate: `10-10-2021`,
    announce: `Супер кот`,
    fullText: `Супер кот, который умеет верстать!`,
    category: [`Животные`, `Игры`],
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/Fg0ikD/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
