//Imports
const express = require('express');
const router = express.Router(); // Using the router method of Express.

// Main Page
router.get('/', (req, res) => {
    res.render('index'); // As a response renderize index.hbs
});

// Exports
module.exports = router;