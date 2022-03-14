'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._sequelize = sequelize;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`articleCategories.CategoryId`)), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => ({...it.get(), count: it.get().count}));
    } else {
      return await this._Category.findAll({raw: true});
    }

  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId, {raw: true});
  }

  async findPage(categoryId, limit, offset) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }

  async create(categoryName) {

    const oldCategory = await this._Category.findOne({
      where: {
        name: categoryName.name
      }
    });

    if (oldCategory) {
      return !oldCategory;
    }

    const category = await this._Category.create(categoryName);

    return category.get();
  }

  async update({categoryId, category}) {
    const [affectedRows] = await this._Category.update(category, {
      where: {
        id: categoryId
      }
    });

    return !!affectedRows;
  }

  async drop({id}) {
    const articleByCategory = await this._ArticleCategory.findOne({
      where: {
        CategoryId: id
      }
    });

    if (articleByCategory) {
      return !articleByCategory;
    }

    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

}

module.exports = CategoryService;
