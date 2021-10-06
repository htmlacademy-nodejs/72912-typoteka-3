'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(query) {
    const searchResult = this._articles.filter((item) => item.title.toLowerCase().includes(query));

    if (searchResult.length === 0) {
      return null;
    }

    return searchResult;
  }
}

module.exports = SearchService;
