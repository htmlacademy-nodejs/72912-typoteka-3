'use strict';

const CategoryService = require(`./category`);
const ArticleService = require(`./articles`);
const CommentService = require(`./comment`);
const SearchService = require(`./search`);
const UserService = require(`./user`);

module.exports = {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
};
