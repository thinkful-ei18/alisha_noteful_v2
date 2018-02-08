'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/* Notes can belong to a folder because we've altered the notes table. However, creating this file is what will allow the folders to be viewed from the browser */

/* ===== GET ALL FOLDERS ===== */
router.get('/folders', (req, res, next) => {

  knex.select('id', 'name')
    .from('folders')
    .orderBy('id')
    .then(folders => { 
      res.json(folders);
    })
    .catch(err => next(err));

});


/* ===== GET FOLDER BY ID ===== */
router.get('/folders/:id', (req, res, next) => {
  
  const folderId = req.params.id;

  knex.select('id', 'name')
    .from('folders')
    .where({
      id: `${folderId}`
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


/* ===== FOLDER UPDATE ===== */
router.put('/folders/:id', (req, res, next) => {

  const folderId = req.params.id;
  const updateObj = {
    name: `${req.body.name}`
  };

  if (!updateObj.name) {
    const err = new Error('Missing the `folder name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where({
      id: `${folderId}`
    })
    .update({
      name: `${updateObj.name}`
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


/* ===== CREATE A FOLDER ===== */
router.post('/folders', (req, res, next) => {

  const { newFolder } = req.body;

  if (!newFolder.name) {
    const err = new Error('Missing the `folder name` in the request body');
    err.status = 400;
    return next(err);
  }

  knex.insert({
    name: `${newFolder.name}`
  })
    .into('folders')
    .then(folder => {
      if (folder) {
        res.location(`http://${req.headers.host}/folders/${folder.id}`).status(201).json(folder);
      }
    })
    .catch(err => next(err));


});


/* ===== DELETE A FOLDER ===== */
router.delete('/folders/:id', (req, res, next) => {

});


module.exports= router;