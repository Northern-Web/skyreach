const express       = require('express');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser')
const ejs           = require('ejs');
const config        = require('./../config/index');

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
        const clubRoutes     = require('./../routes/club.routes');

        // Route Uses
        app.use("/", homeRoutes);
        app.use("/auth", authRoutes);
        app.use("/members/aircrafts", aircraftRoutes);
        app.use("/users", userRoutes);
        app.use("/members/skydives", skydiveRoutes);
        app.use("/members", membersRoutes);
        app.use("/members/clubs", clubRoutes);

        // Start application
        this.server = app.listen( config.port, () => {
            console.log(`${config.app.name} booting in \"${config.app.env}\" mode...`);
            console.log(`${config.app.name} listening on port ${config.port}`);
        });
    }

    get Server () {
        return this.server;
    }
}

module.exports = ExpressLoader;