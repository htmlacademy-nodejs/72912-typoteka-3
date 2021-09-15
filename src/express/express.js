'use strict';

const express = require(`express`);
const PORT = 8080;

const mainRouter = require(`./routes/main-route`);
const myRouter = require(`./routes/my-route`);
const articlesRouter = require(`./routes/articles-route`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.listen(PORT);
