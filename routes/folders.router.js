'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/* Notes can belong to a folder because we've altered the notes table. However, creating this file is what will allow the folders to be viewed from the browser */

/* ===== GET ALL FOLDERS/TAGS ===== */
router.get('/folders', (req, res, next) => {

  knex.select('id', 'name')
    .from('folders')
    .orderBy('id')
    .then(folders => { 
      res.json(folders);
    })
    .catch(err => next(err));

});


/* ===== GET SINGLE FOLDER/TAG BY ID ===== */
router.get('/folders/:id', (req, res, next) => {

  knex.select('id', 'name')
    .from('folders')
    .where({
      id: `${req.params.id}`
    })
    .then(folder => {
      if (folder) {
        res.json(folder);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


/* ===== FOLDER/TAG UPDATE ===== */
router.put('/folders/:id', (req, res, next) => {

  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing the `folder name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.update({ name })
    .from('folders')
    .where({ id: `${req.params.id}`})
    .returning(['id', 'name'])
    .then(([folder]) => {
      if (folder) {
        res.json(folder);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});


/* ===== CREATE A FOLDER/TAG ===== */
router.post('/folders', (req, res, next) => {

  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing the `folder name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.insert({ name })
    .into('folders')
    .returning(['id', 'name']) // if you don't put this in an array, once you create the folder you'll only be returned the value of the id, not the object. i.e. '104' instead of '{"id": "104", "name":"Home"}'
    .then(([folder]) => { // so now you must destructure the array
      if (folder) {
        res.location(`http://${req.originalUrl}/${folder.id}`).status(201).json(folder);
      }
    })
    .catch(err => next(err));


});


/* ===== DELETE A FOLDER/TAG ===== */
router.delete('/folders/:id', (req, res, next) => {

});


module.exports= router;