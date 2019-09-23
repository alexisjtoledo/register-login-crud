// This file contains all the routes for my user system

//Imports
const express = require('express');
const router = express.Router(); // Using the router method of Express.
const User = require('../models/User'); // Importing my users model.
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth'); // My helper to see if the user is authenticated.

// Log-In Page
router.get('/users/login', (req, res) => { // The route of my main page.
    res.render('users/login');
});

// POST route to Log-In
router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/notes', // If the validation is successful, i will get him his notes.
    failureRedirect: '/users/login', // But if it's not, he has to try logging in again.
    failureFlash: true 
})); // To authenticate the user i will use the method i configured on the passport configurations.

// Main Sign-Up Page
router.get('/users/signup', (req, res) => { // The route of my main page.
    res.render('users/signup');
});

// POST route to Sign-Up
router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body; // I'm saving in a constant all the data taken from the form.
    // Verifications
    const errors = []; // I save the possible errors into an array.
    // Name verification.
    if(name.length < 1){
        errors.push({text:'You must have a name...'});
    }
    // E-mail verification
    if(email.length < 1){
        errors.push({text:'You have to insert your e-mail address.'});
    }
    if (password != confirmpassword){ // I check if the password's confirmation match.
        errors.push({text:'Passwords do not match.'});
    }
    if (password.length < 4){ // If the password is too short...
        errors.push({text:'The password must be at least 4 characters.'}); // I will show an alert.
    }
    if(errors.length > 0){ // If there is one or more errors...
        res.render('users/signup', {errors, name, email, password, confirmpassword}); // I will render the form again with all the data that was already there.
    }
    // If it is all correct then create the user:
    else {
        // First of all i will look for the email to see id the user already exists. Check for bugs in this section:
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'The e-mail is already registered.'); // Showing an error message.
            res.redirect('/users/signup');
        }
        /* --- */

        const newUser = new User({name, email, password}); // I create a new user with the data of the form.
        newUser.password = await newUser.encryptPassword(password); // Then i replace the password with my hash created by my model method.
        await newUser.save(); // And finally i save it.
        req.flash('success_msg', 'Thanks for register!'); // I show a message throught flash.
        res.redirect('/users/login'); // Redirecting to the login page.
    }
    
});

// Log-out route
router.get('/users/logout', isAuthenticated, async (req, res) => {
    req.logout(); // Logout method from passport.
    res.redirect('/'); // Redirenting to main page.
});

// Exports
module.exports = router;