// Imports
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Authentication
passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => { // Defining the authentication.
        const user = await User.findOne({email: email}); // Finding the user in the DB.
        if(!user){
            return done(null, false, {message: "The user doesn't exists."}) // callback to end the process if the user doesn't exists.
        } else {
            const match = await user.matchPassword(password); // I call the method i created in the User model to validate the password.
            if (match) {
                return done(null, user); // If it's true, then i get the user its notes.
            } else {
                return done(null, false, {message: 'The password is incorrect.'}); // If the user matches but the password don't, i return an error message.
            }
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id); // I keep the id into a session once the user has been authenticated.
});

// If there's a user in the session i will search by its ID on the DB.
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user); // If i find it i will response with a callback.
    });
});
