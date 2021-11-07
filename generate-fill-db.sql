
    INSERT INTO categories(name) VALUES
    ('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, create_at, picture, announce, full_text, user_id) VALUES
    ('Обзор новейшего смартфона', '30.09.2021, 07:26:13', 'avatar-12.png', 'Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?', 'Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.',  2);
    ALTER TABLE articles ENABLE TRIGGER ALL;
    INSERT INTO comments(text, user_id, article_id) VALUES
    ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?', 1, 1),
('Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного...', 1, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?', 2, 1);
    ALTER TABLE comments ENABLE TRIGGER ALL;
    ALTER TABLE articles_categories DISABLE TRIGGER ALL;
    INSERT INTO articles_categories(article_id, category_id) VALUES
    (1, 8);
    ALTER TABLE articles_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;