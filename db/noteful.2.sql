--`psql -U dev -f ./db/noteful.2.sql -d noteful-app`
SELECT CURRENT_DATE;

/* ======== DROP EXISTING TABLES ========*/
-- pay attention to the order! if table B relies on table A for info, table B must be deleted first. similar to DELETE RESTRICT
DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS tags;


/* ======== CREATE TABLES ========*/
-- creating tables in the opposite order that they're dropped
CREATE TABLE tags
(
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE folders
(
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);
ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE notes
(
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT now(),
  folder_id int REFERENCES folders ON DELETE SET NULL
);
ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

CREATE TABLE notes_tags
(
  note_id int NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id int NOT NULL REFERENCES tags ON DELETE CASCADE
);


/* ======== INSERT INTO TABLES ========*/
-- inserting tables in the opposite order that they're dropped
INSERT INTO tags
  (name)
VALUES
  ('alpha'),
  ('beta'),
  ('gamma');

INSERT INTO folders
  (name)
VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

INSERT INTO notes
  (title, content, folder_id)
VALUES
  ( '5 life lessons learned from cats', 'Lorem ipsum i like cats', 100
  ),
  ( 'What the government doesn''t want you to know about cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a.', 100
  );

INSERT INTO notes
  (title, content)
VALUES
  ( 'The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet laborum.'
  ),
  ( '7 things lady gaga has in common with cats', 'Posuere sollicitudin aliquam'
  ),
  ( 'The most incredible article about cats you''ll ever read', 'Lorem ipsum dolor sit'
  ),
  ( '10 ways cats can help you live to 100', 'Posuere sollicitudin aliquam ultrices'
  ),
  ( '9 reasons you can blame the recession on cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
  ),
  ( '10 ways marketers are making you addicted to cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a'
  ),
  ( '11 ways investing in cats can make you a millionaire', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod '
  ),
  ( 'Why you should forget everything you learned about cats', 'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis'
  );


INSERT INTO notes_tags
  (note_id, tag_id)
VALUES
  ('1000', '1'),
  ('1000', '2'),
  ('1003', '1'),
  ('1004', '2'),
  ('1005', '3'),
  ('1005', '1'), 
  ('1008', '3');