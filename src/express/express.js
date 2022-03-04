'use strict';
const path = require(`path`);
const express = require(`express`);
const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {EXPIRATION, EXPIRATION_INTERVAL} = require(`../constans`);

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: EXPIRATION,
  checkExpirationInterval: EXPIRATION_INTERVAL
});

sequelize.sync({force: false});

const PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const {HttpCode} = require(`../constans`);

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

app.use((req, res) => {
  const {user} = req.session;
  res.status(HttpCode.NOT_FOUND).render(`errors/404`, {user});
});

app.use((err, req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(PORT);
