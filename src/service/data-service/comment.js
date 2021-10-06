'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constans`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(id) {
    const article = this._articles.find((item) => item.id === id);
    return article.comments;
  }

  findOne(articleId, commentId) {
    const article = this._articles.find((item) => item.id === articleId);
    const comment = article.comments.find((item) => item.id === commentId);

    if (!comment) {
      return null;
    }

    return comment;
  }

  drop(articleId, commentId) {
    const article = this._articles.find((item) => item.id === articleId);
    const comment = article.comments.find((item) => item.id === commentId);

    if (!comment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);
    return comment;
  }

  create(articleId, {comment}) {
    const article = this._articles.find((item) => item.id === articleId);
    const newComment = {id: nanoid(MAX_ID_LENGTH), comment};

    article.comments.push(newComment);

    return newComment;
  }
}

module.exports = CommentService;
