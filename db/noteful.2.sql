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
  ('Love'),
  ('Success'),
  ('Growth'),
  ('Faith');

INSERT INTO notes
  (title, content, folder_id)
VALUES
  ( 'Earl Nightingale', 'We become what
we think about.', 102
  ),
  ( 'Mark Twain', 'Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do, so throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails.  Explore, Dream, Discover.', 102
  ),
  ( 'Galatians 2:20', 'My old self
has been crucified with Christ.[a] It is no longer I who live, but Christ lives in me. So I live in this earthly body by trusting in the Son of God, who loved me and gave himself for me.', 103
);

INSERT INTO notes
  (title, content)
VALUES
  ( 'Chinese Proverb', 'The best time
to plant a tree was 20 years ago. The second best time is now.'
  ),
  ( 'Stephen Covey', 'I am not a product of my circumstances. I am a product of my decisions.'
  ),
  ( 'Maya Angelou', 'I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.'
  ),
  ( 'Gladys Knight and the The Pips', 'Oh, there have been times when times were hard, but always somehow I made it, I made it through. ‘Cause for every moment that I’ve spent hurting, there was a moment that I’ve spent, ah, just loving you, yeah.'
  ),
  ( 'Indira Gandhi', 'You cannot shake hands with a clenched fist.'
  ),
  ( 'Henry James', 'Do not mind anything that anyone tells you about anyone else. Judge everyone and everything for yourself.'
  ),
  ( 'Lao Tzo', 'The journey of a thousand miles begins with one step.'
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