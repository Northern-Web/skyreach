const express    = require('express');
const mongoose   = require('mongoose');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser')
const ejs        = require('ejs');

require('dotenv').config();

const app = express();

// App Uses
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');



// Router Requirements
const homeRoutes    = require("./routes/home.routes");
const authRoutes    = require("./routes/auth.routes");
const membersRoutes = require("./routes/members.routes");
const aircraftRoutes = require("./routes/aircraft.routes");

// Router Uses
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/members", membersRoutes);
app.use("/members/aircrafts", aircraftRoutes);


app.listen(process.env.PORT || 3000, () => {
    mongoose.connect(process.env.DB_URI);
    console.log(`${process.env.APP_NAME} booting in \"${process.env.APP_ENV}\" mode...`);
    console.log(`Successful connection to database \"${process.env.DB_NAME}\".`);
    console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
  });

// Handling Server Error
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })