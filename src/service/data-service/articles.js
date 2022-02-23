'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findTopArticles() {
    const articles = await this._Article.findAll({
      attributes: [
        `id`,
        `announce`,
        [
          Sequelize.fn(
              `COUNT`,
              Sequelize.col(`comments.id`)
          ),
          `commentCount`
        ]
      ],
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: []
      }],
      group: [`Article.id`],
      order: [
        [`count`, `DESC`]
      ]
    });
    return articles.map((item) => item.get())
      .filter((item) => item.commentCount > 0);
  }

  async findPage({limit, offset, comments}) {

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: comments ? [Aliase.CATEGORIES, Aliase.COMMENTS] : [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, articles: rows};
  }

  findOne(id) {
    return this._Article.findByPk(id, {
      include: [Aliase.CATEGORIES,
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          include: [{
            model: this._User,
            as: Aliase.USERS,
            attributes: [`name`, `surname`, `avatar`],
          }]
        }
      ],
      order: [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ]
    }
    );
  }

  async update({articleId, article}) {

    const [affectedRows] = await this._Article.update(article, {
      where: {
        id: articleId,
        userId: article.userId
      }
    });

    if (affectedRows) {
      await this._ArticleCategory.destroy({
        where: {ArticleId: articleId}
      });

      const updatedArticle = await this._Article.findByPk(articleId);
      await updatedArticle.setCategories(article.categories);
    }

    return !!affectedRows;
  }

}

module.exports = ArticleService;
