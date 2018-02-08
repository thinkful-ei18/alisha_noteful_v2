'use strict';

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
/* 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
*/

// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where(function() {
      if (searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('created', 'desc')
    .then(notes => {
      res.json(notes);
    })
    .catch(err => next(err)); 
});

/* ========== GET/READ SINGLE NOTE ========== */
router.get('/notes/:id', (req, res, next) => {
  
  const noteId = req.params.id;

  knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where({
      'notes.id': `${noteId}`
    })
    .then(note => {
      if (note) {
        res.json(note);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title || !updateObj.content) {
    const err = new Error('Must include the `title` and `content` in the request body to update!');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .where({
      id: `${noteId}`
    })
    .update({
      title: `${updateObj.title}`,
      content: `${updateObj.content}`,
      created: new Date()
    })
    .then(note => {
      if (note) {
        res.json(note);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});

/* ========== POST/CREATE NOTE ========== */
router.post('/notes', (req, res, next) => {
  const { title, content, folder_id } = req.body; // destructured object
  console.log('req.body', req.body);
  const newNote = {
    title,
    content,
    folder_id
  };

  /***** Never trust users - validate input *****/
  if (!title || !content) {
    const err = new Error('Must include the `title` and `content` in the request body to create a new note!');
    err.status = 400;
    return next(err);
  }
 
  let noteId;

  knex.insert(newNote) // add the newNote object
    .into('notes') // to the notes table
    .returning('id') // return the id property, which is an array, that was added on the server with the created property. i.e [1004]
    .then(([id]) => { // destructure that array to get the actual value
      noteId = id; // set the variable noteId that was declared above, to the value of the id. i.e. 1004
      return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name') // target the stated columns between the 'notes' and 'folders' tables
        .from('notes') // display all rows from 'notes', but only the id, title, content && folder_id columns
        .leftJoin('folders', 'notes.folder_id', 'folders.id') // add the name of any folder whose id column matches the notes.folder_id column to the corresponding 'notes' row
        .where('notes.id', noteId); // filter further to show the one merged row whose notes.id matches the id # that was destructured
    })
    .then(([result]) => { 
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  knex('notes')
    .where({
      id: `${id}`
    })
    .del()
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});

module.exports = router;