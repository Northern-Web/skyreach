const mongoose   = require('mongoose');
const config     = require('./config/index')

mongoose.Promise = global.Promise;


  // Connect to the DB an initialize the app if successful
  mongoose.connect((config.app.env == 'production' ? config.database.prodUrl : config.database.devUrl))
  .then( () => {
      console.log(`Successful connection to database \"${config.database.name}\".`);
  
    // Create express instance to setup API
    const ExpressLoader = require( "./loaders/Express" );
    new ExpressLoader();
  })
  .catch( err => {
    console.error(err);
  } );