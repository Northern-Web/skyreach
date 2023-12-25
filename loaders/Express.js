const express    = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser')
const ejs        = require('ejs');

class ExpressLoader {
    constructor () {
        const app = express();
    
        // App Uses
        app.use(express.json());
        app.use(express.static('public'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.set('view engine', 'ejs');

        // Router Requirements
        const authRoutes     = require('./../routes/auth.routes');
        const aircraftRoutes = require('./../routes/aircraft.routes');
        const homeRoutes     = require('./../routes/home.routes');
        const userRoutes     = require('./../routes/user.routes');
        const skydiveRoutes  = require('./../routes/jump.routes');
        const membersRoutes  = require('./../routes/members.routes');

        // Route Uses
        app.use("/", homeRoutes);
        app.use("/auth", authRoutes);
        app.use("/aircrafts", aircraftRoutes);
        app.use("/users", userRoutes);
        app.use("/skydives", skydiveRoutes);
        app.use("/members", membersRoutes);

        // Start application
        this.server = app.listen( process.env.PORT, () => {
            console.log(`${process.env.APP_NAME} booting in \"${process.env.APP_ENV}\" mode...`);
            console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
        });
    }

    get Server () {
        return this.server;
    }
}

module.exports = ExpressLoader;