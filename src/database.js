// Imports
const mongoose = require('mongoose'); // To manage the connection with my mongo database.

mongoose.connect('mongodb://localhost/notesdb', { // I'm connecting my app to my database and then configuring it.
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
  .then(db => console.log('DB connected'))
  .catch(err => console.error(err));

// Exports