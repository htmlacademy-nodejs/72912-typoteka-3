'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findOne(id) {
    return this._Comment.findByPk(id, {raw: true});
  }

  async drop(id) {

    const deletedRows = await this._Comment.destroy({
      where: {id}
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
