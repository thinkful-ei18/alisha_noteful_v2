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

  knex.select('id', 'title', 'content', 'created')
    .from('notes')
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

/* ========== GET/READ SINGLE NOTES ========== */
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;


  knex.select('id', 'title', 'content', 'created')
    .from('notes')
    .where({
      id: `${noteId}`
    })
    .then(item => {
      if (item) {
        res.json(item);
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
    const err = new Error('Missing the `title` or `content` in the request body');
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
    .then(item => {
      console.log(item);
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});

/* ========== POST/CREATE ITEM ========== */
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title || !newItem.content) {
    const err = new Error('Missing the `title` or `content` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.insert({
    title: `${newItem.title}`,
    content: `${newItem.content}`
  })
    .into('notes')
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } 
    })
    .catch(err => next(err));
  
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