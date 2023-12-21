const { Aircraft }   = require('./../models/aircraft.model');
const { Discipline } = require('./../models/discipline.model');
const { Country }    = require('./../models/country.model');
const { Import }     = require('./../models/import.model');
const { User }       = require("./../models/user.model");
const { Jump }       = require('./../models/jump.model');
const { SkydiveService } = require('./../services/skydiveService');
const { UserService }    = require('./../services/userService');
const jwt            = require("jsonwebtoken");
const processFile = require("../middleware/upload");

var moment = require('moment');
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
    var user = await UserService.GetUserFromToken(req.cookies);
    var jumps   = await Jump.find({"owner": user.id}).sort('-number');

    res.status(200).render('members/skydives/browse', {
        pageTitle: 'Skyreach - Logbook',
        title: 'Logbook',
        subTitle: '',
        path: '/members/skydives/browse',
        isMember: true,
        skydives: jumps,
        isShared: user.logbook.isShared,
        userId: user.id
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
        skydives: jumps,
        userId: user.id
    });
}

exports.getDetailsPage = async (req, res) => {
    const skydiveId = req.params.id;
    const user = await UserService.GetUserFromToken(req.cookies);
    const skydive = await Jump.findById(skydiveId);
    const discipline = await Discipline.findOne({"abbreviation": skydive.stats.discipline});

    res.status(200).render('members/skydives/jumpItem', {
        pageTitle: 'Skyreach - View Item',
        subTitle: user.name,
        path: '/members/skydives/view',
        isMember: true,
        skydive: skydive,
        discipline: discipline
    });

}

exports.getSharedDetailsPage = async (req, res) => {
    const skydiveId = req.params.skydiveId;
    const userId = req.params.userId;

    try {
        if (!skydiveId || !userId) {
            return res.status(404).redirect('/page-not-found');
        }
    
        const user       = await User.findById(userId);
        const skydive    = await Jump.findById(skydiveId);
        const discipline = await Discipline.findOne({"abbreviation": skydive.stats.discipline});
    
        if (!user || !user.logbook.isShared) {
            return res.status(404).redirect('/page-not-found');
        }
    
        res.status(200).render('members/skydives/jumpItem', {
            pageTitle: 'Skyreach - View Item',
            title: 'Logbook',
            subTitle: user.name,
            path: '/members/skydives/view',
            isMember: false,
            skydive: skydive,
            discipline: discipline
        });

    } catch (err) {
        console.log(err);
    }
}

exports.getImportPage = async (req, res) => {
    const user = await UserService.GetUserFromToken(req.cookies);
    const imports = await Import.find({"owner": user.id, "flags.isImported": false});

    res.status(200).render('members/skydives/import', {
        pageTitle: 'Import Skydives',
        title: 'Import',
        path: '/members/skydives/import',
        imports: imports
    });
}

exports.registerJump = async (req, res, next) => {
    const { jumpNum, date, aircraft, canopy, country, dz,
            altitude, freefalltime, discipline, cutaway,
            linetwists, progressionJump, description
    } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        throw new Error("Error caused by access token");
    }

    var decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    var newCountry = await Country.findOne({"name": country});
    var jumpDate = await moment(date).local(true);

    var jump = new Jump({
        "number": jumpNum,
        "date": jumpDate,
        "aircraft": aircraft,
        "canopy": canopy,
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

exports.uploadExcel = async (req, res) => {
    await processFile(req, res);

    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file!" });
    }

    const user = await UserService.GetUserFromToken(req.cookies);

    const response = await SkydiveService.UploadExcel(req.file, user, res);
    return response;
}