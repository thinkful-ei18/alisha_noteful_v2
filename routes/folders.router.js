'use strict';

const express = require('express');
const knex = require('knex');

const router = express.Router();

/* Notes can belong to a folder because we've altered the notes table. However, creating this file is what will allow the folders to be viewed from the browser */

/* ===== GET ALL FOLDERS ===== */
router.get('/folders', (req, res, next) => {

  knex.select('id', 'name')
    .from('folders')
    .then(folders => { 
      res.json(folders);
    })
    .catch(err => next(err));

});


/* ===== GET FOLDER BY ID ===== */
router.get('/folders/:id', (req, res, next) => {

});


/* ===== FOLDER UPDATE ===== */
router.put('/folders/:id', (req, res, next) => {

});


/* ===== CREATE A FOLDER ===== */
router.post('/folders', (req, res, next) => {

});


/* ===== DELETE A FOLDER ===== */
router.delete('/folders/:id', (req, res, next) => {

});
