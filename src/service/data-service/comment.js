'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findOne({commentId, articleId}) {
    return this._Comment.findOne({
      where: {
        id: commentId,
        articleId
      }
    }, {raw: true});
  }

  async findLastComments() {
    const comments = await this._Comment.findAll({
      attributes: [
        `id`,
        `text`,
        `articleId`,
        `createdAt`
      ],
      include: [{
        model: this._User,
        as: Aliase.USERS,
        attributes: [
          `name`,
          `surname`,
          `avatar`
        ]
      }],
      order: [
        [`createdAt`, `DESC`]
      ],
    });

    return comments.map((item) => item.get());
  }

  async drop({commentId, userId, articleId}) {

    const articleByUser = await this._Article.findOne({
      where: {
        id: articleId,
        userId
      }
    });

    if (!articleByUser) {
      return false;
    }

    const deletedRows = await this._Comment.destroy({
      where: {id: commentId}
    });

    return !!deletedRows;
  }

  create(articleId, text) {
    return this._Comment.create({
      articleId,
      ...text
    });
  }
}

module.exports = CommentService;
