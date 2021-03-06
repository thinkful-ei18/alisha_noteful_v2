'use strict';

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();
const Treeize = require('treeize');



/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name', 'tags.name as tags:name', 'tags.id as tags:id')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
    .where(function() {
      if (searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .where(function() {
      if (folderId) {
        this.where('folder_id', folderId);
      }
    })
    .where(function () {
      if (tagId) {
        const subQuery = knex.select('notes.id')
          .from('notes')
          .innerJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
          .where('notes_tags.tag_id', tagId );
        this.whereIn('notes.id', subQuery );
      }
    })
    .orderBy('created', 'desc')
    .then(notes => {
      const tree = new Treeize(); // create a new instance of Treeize as the variable tree
      // tree.setOptions({ output: { prune: false } });
      tree.grow(notes); // pass 'notes' (which is an array of objects) to .grow()
      const hydrated = tree.getData();
      res.json(hydrated);
    })
    .catch(err => next(err)); 

});


/* ========== GET/READ SINGLE NOTE ========== */
router.get('/notes/:id', (req, res, next) => {
  
  const noteId = req.params.id;

  knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name', 'tags.name as tags:name', 'tags.id as tags:id')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
    .where( 'notes.id', noteId )
    .then( note => { // if the noteId has multiple tags, the array will contain as many objects as there are tags. the only different prop between each one will be the tag prop. before each object is the word 'anonymous'
      if (note.length) {
        const tree = new Treeize(); // initiate a new instance of Treeize
        // tree.setOptions({ output: { prune: false } }); // don't filter out props with a null value
        tree.grow(note); // behind the scenes work with baseOptions, data, stats and options objects
        const hydrated = tree.getData(); // the same array of objects passed in as the argument, but with no 'anonymous'
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});


/* ========== PUT/UPDATE A SINGLE NOTE ========== */
router.put('/notes/:id', (req, res, next) => {
  
  const noteId = req.params.id;
  const { title, content, folder_id, tags } = req.body; // these keys are established in noteful.js

  /***** Never trust users - validate input *****/

  if (!title || !content) {
    const err = new Error('Must include the `title` and `content` in the request body to update!');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .update({title, content, folder_id, created: new Date()})
    .where({ id: `${noteId}`})
    .then( () => {
      return knex.del()
        .from('notes_tags')
        .where({ note_id: `${noteId}` });
    })
    .then( () => {
      const tagsInsert = tags.map(tid => ({ note_id: noteId, tag_id: tid }));
      return knex.insert(tagsInsert)
        .into('notes_tags');
    })
    .then( () => {
      return knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name', 'tags.name as tags:name', 'tags.id as tags:id')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then( note => {
      if (note.length) { // if the above validations fail at any point, a note won't be passed into the above 'then' promise. thus, the note.length would be 0. 0 is a falsy number, which means this code block won't get run, the catch will get called instead.
        const tree = new Treeize();
        tree.setOptions({ output: { prune: false } });
        tree.grow(note);
        const hydrated = tree.getData();
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});


/* ========== POST/CREATE NOTE ========== */
router.post('/notes', (req, res, next) => {
  const { title, content, folder_id, tags=[] } = req.body; // destructured object
  console.log('TAGS',  {tags});
  /***** Never trust users - validate input *****/
  if (!title || !content) {
    const err = new Error('Must include the `title` and `content` in the request body to create a new note!');
    err.status = 400;
    return next(err);
  }
 
  let noteId;

  knex.insert( { title, content, folder_id } ) // add the prop's listed
    .into('notes') // to the notes table
    .returning('id') // return the id property, which is an object inside an array, that was added on the server with the created property. i.e [1004]
    .then(([id]) => { // destructure that array to get access to the 'id' property
      noteId = id; // set the variable noteId that was declared above, to the value of the id key. i.e. 1004
      const tagsInsert = tags.map( tagId => ( { note_id: noteId, tag_id: tagId } )); // the curly braces are wrapped in parens so that the arrow doesn't think the curly braces are to establish a function. the tagId variable is defined as whatever number is currently being assessed in the tags array, because that's the variable name of the argument.
      return knex.insert(tagsInsert) // tagsInsert will be an array with objects equal to the amount of tags that were passed in
        .into('notes_tags');
    })
    .then(() => {
      return knex.select('notes.id', 'title', 'content', 'created', 'folder_id', 'folders.name as folder_name', 'tags.name as tags:name', 'tags.id as tags:id') // target the stated columns between the 'notes' and 'folders' tables
        .from('notes') // display all rows from 'notes', but only the id, title, content && folder_id columns
        .leftJoin('folders', 'notes.folder_id', 'folders.id') // add the name of any folder whose id column matches the notes.folder_id column to the corresponding 'notes' row
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', noteId); // filter further to show the one merged row whose notes.id matches the id # that was destructured
    })
    // the above return statement returns an array with a single object. that object is the one merged row from the 'where' clause above and has all the columns from the 'select' clause
    .then( note => {
      console.log('NOTE', note);
      // if 'note' is the arg, postman returns only one tags value object, the last one. but when I GET that note, it shows all of the tags value objects
      // if '[note]' is the arg, postman returns an empty array, but when I GET that note, it shows one object with all of the tags value objects
      if (note) {
        const tree = new Treeize(); // treeize must get passed an array!
        tree.setOptions({ output: { prune: false } });
        tree.grow(note);
        const hydrated = tree.getData();
        console.log('HYDRATED', hydrated);
        res.location(`${req.originalUrl}/${note.id}`).status(201).json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => console.error(err)); // console.error(err)
});


/* ========== DELETE/REMOVE A SINGLE NOTE ========== */
router.delete('/notes/:id', (req, res, next) => {
  
  knex.del()
    .from('notes')
    .where({
      id: `${req.params.id}`
    })
    .then( count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
  
});

module.exports = router;