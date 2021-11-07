CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(255) NOT NULL
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  create_at timestamp DEFAULT CURRENT_TIMESTAMP,
  picture varchar(50) NOT NULL,
  announce text NOT NULL,
  full_text text NOT NULL,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX ON articles(title);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  create_at timestamp DEFAULT CURRENT_TIMESTAMP,
  user_id integer NOT NULL,
  article_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE articles_categories(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
