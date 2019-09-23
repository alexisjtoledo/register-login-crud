
// First of all i create my 'helper' object.
const helpers = {};

// Then i create a method to check if the user is authenticated
helpers.isAuthenticated = async (req, res, next) => {
    if(req.isAuthenticated()){ // Getting the method isAuthenticated from passport, this will give me a true or a false.
        return next();
    } 
    req.flash('error_msg', 'You have to log in to see your notes.'); // I show the user an alert.
    res.redirect('/users/login'); // I redirect the user to the log in page.

}

// And finally i export it.
module.exports = helpers;