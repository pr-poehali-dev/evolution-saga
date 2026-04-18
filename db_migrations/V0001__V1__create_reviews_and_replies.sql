
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  station VARCHAR(200) NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE review_replies (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO reviews (name, station, text, rating) VALUES
  ('Алексей М.', 'АЗС №3, ул. Ленина', 'Отличная заправка! Всегда чисто, персонал вежливый. Заправляюсь здесь уже 2 года, качество топлива не подводит.', 5),
  ('Марина К.', 'АЗС №7, трасса М5', 'Быстро обслужили, очереди не было. Удобная оплата по QR-коду. Приятный кофе в магазинчике.', 5),
  ('Дмитрий С.', 'АЗС №1, пр. Мира', 'Немного долго ждал на кассе, но в целом всё нормально. Топливо хорошего качества.', 4);

INSERT INTO review_replies (review_id, text) VALUES
  (1, 'Алексей, спасибо за тёплые слова! Рады видеть вас снова на наших станциях.'),
  (3, 'Дмитрий, приносим извинения за ожидание. Мы работаем над улучшением скорости обслуживания на этой станции.');
