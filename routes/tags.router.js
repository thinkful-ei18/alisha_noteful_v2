'use strict';

const knex = require('../knex');
const express = require('express');

const router = express.Router();


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
  

});

/* ========== PUT/UPDATE A SINGLE TAG ========== */
router.put('/tags/:id', (req, res, next) => {


});

/* ========== POST/CREATE TAG ========== */
router.post('/tags', (req, res, next) => {
  
  
});

/* ========== DELETE/REMOVE A SINGLE TAG ========== */
router.delete('/tags/:id', (req, res, next) => {
  
});


module.exports = router;
