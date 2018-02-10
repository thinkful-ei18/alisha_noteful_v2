'use strict';

const knex = require('../../knex');

function seedDataFolders() {
  const folders = require('./folders'); // load the code in the folders.json file 
  return knex('folders').del() // select the folders table from the dband delete the info
    .then(() => knex('folders').insert(folders)); 
  // then insert the data from the folders.json file into the folders table.
}

function seedDataTags() {
  const tags = require('./tags');
  return knex('tags').del()
    .then(() => knex('tags').insert(tags));
}

function seedDataNotes() {
  const notes = require('./notes');
  return knex('notes').del()
    .then(() => knex('notes').insert(notes));
}

function seedDataNotesTags() {
  const notes_tags = require('./notes_tags');
  return knex('notes_tags').del()
    .then(() => knex('notes_tags').insert(notes_tags));
}

function seedData() {
  return Promise.all([seedDataFolders(), seedDataTags()])
    .then(() => seedDataNotes())
    .then(() => seedDataNotesTags());
}

module.exports = seedData;