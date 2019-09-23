// Imports 
const express = require ('express');
const path = require('path'); // I'll use Path to manage my directories local routes.
const exphbs = require('express-handlebars'); // I'll use handlebars as a template engine.
const methodOverride = require('method-override'); // I'll use it to extend the forms functionality.
const session = require('express-session'); // To handle the sessions.
const flash = require('connect-flash'); // To send messages between pages.
const passport = require('passport') // To handle the authentication of my users.

// Initializations
const app = express(); // Initializing my server.
require('./database'); // Importing my database configuration.
require('./config/passport'); // Importing my passport configuration.

// Settings
app.set('port', process.env.PORT || 3000); // Cloud services could give you a Port, so i'm telling it that if there is an existing port it has to take it, but if it's not, then it should take the 3000.
app.set('views', path.join(__dirname, 'views')); // Defining the route of my "views" folder.
app.engine('.hbs', exphbs({
    defaultLayout: 'main', // This is the main layout of the app.
    layoutsDir: path.join(app.get('views'), 'layouts'), // Defining the route of my layouts folder.
    partialsDir: path.join(app.get('views'), 'partials'), // This is where i will save little parts of HTML who i could use in every page when rendering.
    extname: '.hbs' // Extension of all my layout files.
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended: false})); // To understand when a form is telling me some encoded data.
app.use(methodOverride('_method')); // To checke the hidden imput of the form and make it able to use a PUT method.
app.use(session({
    secret: 'secretkey', // Secret word.
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); // Initializing passport.
app.use(passport.session()); // To use the session (created above).
app.use(flash()); // Initializing flash.

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg') // This will be my global variable to send success messages.
    res.locals.error_msg = req.flash('error_msg'); // This will be my global variable to send error messages.
    res.locals.error = req.flash('error'); // This will be my global variable to send my passport error messages.
    res.locals.user = req.user || null; // I have getting the info of the current user from his passport session. Otherwise the value is null.
    next();
});


// Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public'))); // Defining my public folder.

// Server listening
app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
});

// Exports
