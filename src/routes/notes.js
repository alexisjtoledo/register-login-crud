// This file contains all the routes for my CRUD system.

//Imports
const express = require('express');
const router = express.Router(); // Using the router method of Express.
const Note = require('../models/Note'); // This is the model i defined to my Note documents.
const { isAuthenticated } = require('../helpers/auth'); // My helper to see if the user is authenticated.


// Notes main page
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}); // I get all my documents from my DB and put them into a constant (ordered by their creation dates).
    res.render('notes/all-notes', {notes}); // Then i render the response by giving it the content of my constant.
});

// Add new note page
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

// Post method of adding a new note.
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description} = req.body; // Getting the title and the description form the body of my request (destructuring).
    // Manual Validation
    const errors = []; // This array is where i will put my possible error messages.
    if (!title){ // If my body doesn't have a title, then i will return this error.
        errors.push({text: 'Please write a title'});
    }
    if(!description){ // If my body doesn't have a description, then i will return this error.
        errors.push({text: 'Please write a description'});
    }
    if(errors.length > 0){ // If a have more than 0 errors, i will display them.
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    } else { // if anything goes OK, then create a new Note
        const newNote = new Note({
            title,
            description,
        });
        newNote.user = req.user.id; // I assign the id that passport is given me to the user parameter of the new note.
        await newNote.save();   // I save that newNote i've created into my DB.
        req.flash('success_msg', 'Note added successfully.'); // Sending my message alert through flash
        res.redirect('/notes'); // And redirect to my notes main page.
    }
});

// GET route for showing the note i want to update.
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => { // I get the id of the note.
    const note = await Note.findById(req.params.id); // Searching into the DB using the ID that i have received.
    res.render('notes/edit-note', {note}); // I send the data who is already saved and ready to modify.

});

// PUT route to send the updated note to the DB.
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body; // I save the body of my request into a constant.
    await Note.findByIdAndUpdate(req.params.id, { // Then i look for that document in the DB and update its values.
        title,
        description
    });
    req.flash('success_msg', 'Note updated successfully.'); // Sending my message alert through flash
    res.redirect('/notes'); // Finally i redirect to my notes main page.
});

// DELETE method to erase the note from the DB.
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id); // I look for the note into my DB and i delete it.
    req.flash('success_msg', 'Note deleted successfully.'); // Sending my message alert through flash.
    res.redirect('/notes'); // Finally i redirect to my notes main page.
});

// Exports
module.exports = router;