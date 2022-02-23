'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constans`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._https = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._https.request({url, ...options});
    return response.data;
  }

  getArticles({offset, limit, comments, topArticles, lastComments, userId}) {
    return this._load(`/articles`, {params: {offset, limit, comments, topArticles, lastComments, userId}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  async getCategory({categoryId, offset, limit}) {
    return this._load(`/category/${categoryId}`, {params: {offset, limit}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  async editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteArticle({articleId, userId}) {
    return this._load(`/articles/${articleId}`, {
      method: HttpMethod.DELETE,
      data: {
        userId
      }
    });
  }

  async deleteComment({articleId, commentId, userId}) {

    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      data: {
        articleId,
        commentId,
        userId
      }
    });
  }

  async addCategory(data) {
    return this._load(`/category`, {
      method: HttpMethod.POST,
      data
    });
  }

  async editCategory({id, name}) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data: {
        name,
      }
    });
  }

  async deleteCategory({categoryId}) {
    return this._load(`/category/${categoryId}/delete`, {
      method: HttpMethod.DELETE,
      data: {
        categoryId
      }
    });
  }

  async auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
