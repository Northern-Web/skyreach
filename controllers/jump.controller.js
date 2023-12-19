const { Aircraft }   = require('./../models/aircraft.model');
const { Discipline } = require('./../models/discipline.model');
const { Country }    = require('./../models/country.model');
const { User }       = require("./../models/user.model");
const jwt            = require("jsonwebtoken");
const { Jump } = require('../models/jump.model');
require("dotenv").config();

exports.getRegistrationPage = async (req, res, next) => {
    const aircrafts   = await Aircraft.find({"isActive": true}).sort('manufacturer');
    const disciplines = await Discipline.find({"isActive": true}).sort('name');
    const countries   = await Country.find({"isActive": true}).sort('name');

    res.status(200).render('members/skydives/register', {
        pageTitle: 'Skyreach - Add skydive',
        path: '/members/skydives/add',
        aircrafts: aircrafts,
        disciplines: disciplines,
        countries: countries
    });
}

exports.getLogbookPage = async (req, res, next) => {
    let token   = req.cookies["x-access-token"];
    var decoded = await jwt.verify(token, process.env.JWT_SECRET);
    var jumps   = await Jump.find({"owner": decoded.id}).sort('date');

    res.status(200).render('members/skydives/browse', {
        pageTitle: 'Skyreach - Logbook',
        title: 'Logbook',
        subTitle: '',
        path: '/members/skydives/browse',
        isMember: true,
        skydives: jumps
    });
}

exports.getSharedLoogbookPage = async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        res.status(404).redirect('/page-not-found');
    }

    const user  = await User.findById(id);
    const jumps = await Jump.find({"owner": id}).sort('-number');

    if (!user || !user.logbook.isShared) {
        res.status(404).redirect('/page-not-found');
    }

    res.status(200).render('members/skydives/browse', {
        pageTitle: 'Logbook',
        title: 'Logbook',
        subTitle: user.name,
        path: '/members/skydives/browse',
        isMember: false,
        skydives: jumps
    });


}

exports.registerJump = async (req, res, next) => {
    const { jumpNum, date, aircraft, country, dz,
            altitude, freefalltime, discipline, 
            cutaway, linetwists, progressionJump, description
    } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        throw new Error("Error caused by access token");
    }

    var decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    var newCountry = await Country.findOne({"name": country});

    var jump = new Jump({
        "number": jumpNum,
        "date": date,
        "aircraft": aircraft,
        "location.country": newCountry.name,
        "location.countryCode": newCountry.isoCode,
        "location.dropzone": dz,
        "stats.altitude": altitude,
        "stats.freefalltime": freefalltime,
        "stats.discipline": discipline,
        "stats.isEmergencyProcedure": (cutaway) ? true : false,
        "stats.isLineTwists": (linetwists) ? true : false,
        "stats.isProgressionJump": (progressionJump) ? true : false,
        "description": description,
        "owner": user.id
    });

    jump.save();
    res.status(201).redirect('/members/skydives/browse');

}