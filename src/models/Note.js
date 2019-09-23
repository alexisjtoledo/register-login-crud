// In this file i will give a format to my Notes using the Schema component of mongoose.

// Imports
const mongoose = require('mongoose');
const {Schema} = mongoose; 

// And this is how my mongo document will look like.
const NoteSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type:String} // In the moment i create a new note, i will assign it to a user.
});

// Exports
module.exports = mongoose.model('Note', NoteSchema);