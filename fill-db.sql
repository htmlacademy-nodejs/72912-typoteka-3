/*
  Добавление категорий в таблицу
*/

INSERT INTO categories VALUES
  (DEFAULT, 'Деревья'),
  (DEFAULT, 'IT'),
  (DEFAULT, 'Кино'),
  (DEFAULT, 'Программирование'),
  (DEFAULT, 'За жизнь'),
  (DEFAULT, 'Разное');


/*
  Добавление пользователей в таблицу
*/

INSERT INTO users VALUES
  (DEFAULT, 'test@go.com', '123', 'Alex', 'Regbich', 'avatar1'),
  (DEFAULT, 'marti@go.com', 'csdc434', 'Marti', 'king', 'avatar2'),
  (DEFAULT, 'boss@king.com', 'vf342', 'Andrey', 'BigBoss', 'avatar3');

/*
  Добавление публикаций в таблицу
*/
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles VALUES
  (DEFAULT, 'Дом', '1955-09-21', 'picture1', 'Какой дом мы построили', 'Полный текст про описание дома', 3),
  (DEFAULT, 'Нейросеть', '2021-01-15', 'picture2', 'Нейросеть из майнкрафта', 'Нейросеть из майнкрафта покарила мир!', 1),
  (DEFAULT, 'Приключения Банифация', '1989-04-08', 'picture3', 'Переосмысление мультфильма', 'Перезапуск мультфильма оказался очень усспешным', 2);
ALTER TABLE articles ENABLE TRIGGER ALL;

/*
  Добавление комментариев в таблицу
*/
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments  VALUES
  (DEFAULT, 'Дом фигня, я сделал бы лучше', '2021-10-29', 2, 1),
  (DEFAULT, 'Нейросеть на Javascript top!', '2021-04-29', 3, 2),
  (DEFAULT, 'Лучший мультфильм для детей', '2020-03-21', 1, 3),
  (DEFAULT, 'А во сколько обошлась вся стройка вам?', '2021-10-29', 2, 1),
  (DEFAULT, 'Обожаю майнрафт', '2021-04-29', 3, 2),
  (DEFAULT, 'Какой прекрасный лев', '2020-03-21', 1, 3);
ALTER TABLE comments ENABLE TRIGGER ALL;

/*
  Добавление связей между публикациями и категориями в таблицу
*/
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories VALUES
  (1, 1),
  (2, 2),
  (3, 3);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
