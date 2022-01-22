'use strict';
const path = require(`path`);
const express = require(`express`);
const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

const PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const mainRouter = require(`./routes/main-route`);
const myRouter = require(`./routes/my-route`);
const articlesRouter = require(`./routes/articles-route`);

const app = express();

app.use(express.urlencoded({extended: false}));

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));


app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(PORT);
