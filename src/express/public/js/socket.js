'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const createCommentElement = (comment) => {
    const commentTemplate = document.querySelector(`#comment-template`);
    const commentElement = commentTemplate.cloneNode(true).content;

    if (comment.avatar.length > 0) {
      commentElement.querySelector(`.last__list-image`).src = `/img/${comment.avatar}`;
    } else {
      commentElement.querySelector(`.last__list-image`).src = `/img/icons/smile.svg`;
    }

    commentElement.querySelector(`.last__list-name`).textContent = `${comment.name} ${comment.surname}`;
    commentElement.querySelector(`.last__list-link`).href = `articles/${comment.articleId}/${comment.id}`;
    commentElement.querySelector(`.last__list-link`).textContent = comment.text;

    return commentElement;
  };

  const updateCommentsElements = (comment) => {
    const MAX_COMMENTS = 4;

    const commentsList = document.querySelector('.last__list');
    const commentElements = commentsList.querySelectorAll('li');

    if (commentElements.length === MAX_COMMENTS) {
      commentElements[commentElements.length - 1].remove();
    }

    commentsList.prepend(createCommentElement(comment));

  };

  const createArticleElement = (article) => {
    const articleTemplate = document.querySelector(`#top-article-template`);
    const articleElement = articleTemplate.cloneNode(true).content;

    articleElement.querySelector(`a.hot__list-item`).href = `articles/${article.id}`;
    articleElement.querySelector(`a.hot__list-item`).textContent = article.announce;

    const sup = document.createElement('sup');
    sup.classList.add('hot__link-sup');
    sup.textContent = article.commentCount;

    articleElement.querySelector(`a.hot__list-item`).append(sup);

    return articleElement;
  };

  const updateTopArticles = (articles) => {
    const articlesList = document.querySelector('.hot__list');

    while (articlesList.firstChild) {
      articlesList.firstChild.remove();
    };

    const test = document.createDocumentFragment();

    articles.forEach((article) => {
      test.appendChild(createArticleElement(article));
    });

    articlesList.append(test);
  }

  socket.addEventListener(`comment:create`, ({adaptedComment, articlesTop}) => {
    updateCommentsElements(adaptedComment);
    updateTopArticles(articlesTop);
  });

})();
