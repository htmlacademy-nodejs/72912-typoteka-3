
/*
  Получить список всех категорий
*/

SELECT * FROM categories;


/*
  Получить список не пустых категорий
*/

SELECT id, name FROM categories
  JOIN articles_categories
  ON id = category_id
  GROUP BY id;


/*
  Категории с количеством публикаций
*/

SELECT id, name, count(article_id)
  FROM categories
  LEFT JOIN articles_categories
  ON id = category_id
  GROUP BY id;


/*
  Список публикаций, сначала свежие
*/

SELECT
  articles.id,
  articles.title,
  articles.announce,
  to_char(articles.create_at, 'YYYY') AS create_at,
  concat(users.first_name, ' ', users.last_name, ' ', users.email) AS "User",
  count(comments.id) as comments_count,
  categories.name AS categories_list
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN users ON users.id = articles.user_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  GROUP BY articles.id, users.first_name, users.last_name, users.email, categories.name
  ORDER BY articles.create_at DESC;


/*
  Детальная информация по публикации
*/

SELECT
  articles.*,
  to_char(articles.create_at, 'YYYY') AS create_at,
  concat(users.first_name, ' ', users.last_name, ' ', users.email) AS "User",
  count(comments.id) as comments_count,
  categories.name AS categories_list
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN users ON users.id = articles.user_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
WHERE articles.id = 1
  GROUP BY articles.id, users.first_name, users.last_name, users.email, categories.name;


/*
  Получить 5 свежих комментариев
*/

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.create_at DESC
  LIMIT 5;


/*
  Получить комментарии для определенной публикации (сначала свежие)
*/

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.create_at DESC;


/*
  Обновить заголовок определенной публикации
*/

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
