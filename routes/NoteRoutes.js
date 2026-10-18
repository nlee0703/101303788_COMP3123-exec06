const noteModel = require('../models/NotesModel.js');
const express = require('express');
const noteRoutes = express.Router();

// Formats a date like the sample payload in the README: 06/Oct/2025
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDate = (d = new Date()) =>
    `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`;

// Only allow these fields to be set from the request body
const pickFields = (content) => {
    const fields = {};
    ['noteTitle', 'noteDescription', 'priority'].forEach((key) => {
        if (content[key] !== undefined) fields[key] = content[key];
    });
    return fields;
};

// Send a suitable response for common errors
const handleError = (err, res) => {
    if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
    }
    if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid note id' });
    }
    console.error(err);
    return res.status(500).send({ message: 'Server Error' });
};

//TODO - Create a new Note
//http://mongoosejs.com/docs/api.html#document_Document-save
noteRoutes.post('/notes', async (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    //TODO - Write your code here to save the note
    try {
        const content = req.body.content;
        const note = new noteModel({
            ...pickFields(content),
            dateAdded: content.dateAdded || formatDate(),
            dateUpdated: content.dateUpdated || formatDate()
        });
        const saved = await note.save();
        res.status(201).send(saved);
    } catch (err) {
        handleError(err, res);
    }
});

//TODO - Retrieve all Notes
//http://mongoosejs.com/docs/api.html#find_find
noteRoutes.get('/notes', async (req, res) => {
    // (The starter's "content can not be empty" check was removed here: a GET has no body)
    //TODO - Write your code here to returns all note
    try {
        const notes = await noteModel.find();
        res.send(notes);
    } catch (err) {
        handleError(err, res);
    }
});

//TODO - Retrieve a single Note with noteId
//http://mongoosejs.com/docs/api.html#findbyid_findById
noteRoutes.get('/notes/:noteId', async (req, res) => {
    // (The starter's "content can not be empty" check was removed here: a GET has no body)
    //TODO - Write your code here to return onlt one note using noteid
    try {
        const note = await noteModel.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    } catch (err) {
        handleError(err, res);
    }
});

//TODO - Update a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
noteRoutes.put('/notes/:noteId', async (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    //TODO - Write your code here to update the note using noteid
    try {
        const update = { ...pickFields(req.body.content), dateUpdated: formatDate() };
        const note = await noteModel.findByIdAndUpdate(req.params.noteId, update, {
            new: true,
            runValidators: true
        });
        if (!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    } catch (err) {
        handleError(err, res);
    }
});

//TODO - Delete a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
noteRoutes.delete('/notes/:noteId', async (req, res) => {
    // (The starter's "content can not be empty" check was removed here: a DELETE has no body)
    //TODO - Write your code here to delete the note using noteid
    // findByIdAndRemove no longer exists in Mongoose 8, so findByIdAndDelete is used instead
    try {
        const note = await noteModel.findByIdAndDelete(req.params.noteId);
        if (!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({ message: "Note deleted successfully!" });
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = noteRoutes;
