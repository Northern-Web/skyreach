const mongoose   = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;


  // Connect to the DB an initialize the app if successful
  mongoose.connect(process.env.DB_URI)
  .then( () => {
      console.log(`Successful connection to database \"${process.env.DB_NAME}\".`);
  
    // Create express instance to setup API
    const ExpressLoader = require( "./loaders/Express" );
    new ExpressLoader();
  })
  .catch( err => {
    console.error(err);
  } );