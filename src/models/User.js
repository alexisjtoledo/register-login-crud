// In this file i will give a format to my Users using the Schema component of mongoose.

// Imports
const mongoose = require('mongoose');
const {Schema} = mongoose; 
const bcrypt = require('bcryptjs');

// And this is how my mongo document will look like.
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

// Methods
// Encrypting my password
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // I am generating a hash for the password by aplying ten times the algorithm.
    const hash = await bcrypt.hash(password, salt); // I am giving the hash to the password.
    return hash; // And then i'm returning the hash.
}
// Comparing the passwords
UserSchema.methods.matchPassword = async function (password) { // I can't use the arrow function because i need the scope.
    return await bcrypt.compare(password, this.password); // Comparing the password i am receiving with the password of my model.
}

// Exports
module.exports = mongoose.model('User', UserSchema);