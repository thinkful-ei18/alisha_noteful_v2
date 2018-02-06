'use strict';

const knex = require('../knex');

// knex.select(1).then(res => console.log(res));


/* ========== GET/READ ALL NOTES ========== */

// let searchTerm = 'ways';

// knex.select('*')
//   .from('notes')
//   .where('title', 'like', `%${searchTerm}%`)
//   .then(results => console.log(JSON.stringify(results, null, 4)));


/* ========== GET/READ SINGLE NOTES ========== */

// const noteId = 1007;

// knex.select('')
//   .from('notes')
//   .where({
//     id: `${noteId}`
//   })
//   .then(results => console.log(JSON.stringify(results, null, 4)));


/* ========== PUT/UPDATE A SINGLE ITEM ========== */

// const noteId = 1002;
// const updateObj = {
//   title: 'Juma Ikangaa ',
//   content: 'The will to win means nothing without the will to prepare.'
// };

// knex('notes')
//   .where({
//     id: `${noteId}`
//   })
//   .update({
//     title: `${updateObj.title}`,
//     content: `${updateObj.content}`
//   })
//   .then(results => console.log(JSON.stringify(results, null, 4)));

// knex.select('')
//   .from('notes')
//   .where({id: '1002'})
//   .then(results => console.log(JSON.stringify(results, null, 4)));