'use strict';

const knex = require('../knex');
const express = require('express');

const router = express.Router();
const { UNIQUE_VIOLATION } = require('pg-error-constants');


/* ========== GET/READ ALL TAGS ========== */
router.get('/tags', (req, res, next) => {
  
  knex.select('id', 'name')
    .from('tags')
    .then(tags => {
      res.json(tags);
    })
    .catch( err => next(err));

});

/* ========== GET/READ SINGLE TAG ========== */
router.get('/tags/:id', (req, res, next) => {
  
  knex.select('id', 'name')
    .from('tags')
    .where({ id: `${req.params.id}`})
    .then( tag => {
      if (tag) {
        res.json(tag);
      } else {
        next();
      }
    })
    .catch( err => next(err));

});

/* ========== PUT/UPDATE A SINGLE TAG ========== */
router.put('/tags/:id', (req, res, next) => {

  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing the `tag name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.update({ name })
    .from('tags')
    .where({ id: `${req.params.id}`})
    .then( tag => {
      if (tag) {
        res.json(tag);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'tags_name_key') {
        err = new Error('Tags name is already taken');
        err.status = 409;
      }
      next(err);
    });

});

/* ========== POST/CREATE TAG ========== */
router.post('/tags', (req, res, next) => {
  
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing the `tag name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.insert({ name })
    .from('tags')
    .returning(['id', 'name'])
    .then( ([tag]) => {
      res.location(`${req.originalUrl}${tag.id}`).status(201).json(tag);
    })
    .catch(err => {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'tags_name_key') {
        err = new Error('Tags name is already taken');
        err.status = 409;
      }
      next(err);
    });
  
});

/* ========== DELETE/REMOVE A SINGLE TAG ========== */
router.delete('/tags/:id', (req, res, next) => {
  
});


module.exports = router;
