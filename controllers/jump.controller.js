const { Import }        = require('./../models/import.model');
const SkydiveService    = require('./../services/skydive.service');
const CountryService    = require('./../services/country.service');
const UserService       = require('./../services/user.service');
const DisciplineService = require('./../services/discipline.service');
const AircraftService   = require('./../services/aircraft.service');
const processFile       = require("../middleware/upload");

var moment = require('moment');
require("dotenv").config();

const userService       = new UserService();
const countryService    = new CountryService();
const skydiveService    = new SkydiveService();
const disciplineService = new DisciplineService();
const aircraftService   = new AircraftService();

exports.getRegistrationPage = async (req, res, next) => {
    try {
        const token       = req.cookies['x-access-token'];
        const member      = await userService.GetUserFromToken(token);   
        const aircrafts   = await aircraftService.GetAircrafts({"isActive": true}, {"sort": "manufacturer"});
        const disciplines = await disciplineService.GetDisciplines({"isActive": true}, {"sort": "name"});
        const countries   = await countryService.GetCountries({"isActive": true}, {"sort": "name"});

        res.status(200).render('members/skydives/register', {
            pageTitle: 'Skyreach - Add skydive',
            path: '/members/skydives/add',
            aircrafts: aircrafts,
            disciplines: disciplines,
            countries: countries,
            memberCountryCode: member.address.countryCode
        });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

exports.getLogbookPage = async (req, res, next) => {
    try {
        const token = req.cookies['x-access-token'];
        var member  = await userService.GetUserFromToken(token);
        var jumps   = await skydiveService.GetSkydives({"owner": member.id}, {"sort": "-number"});

        res.status(200).render('members/skydives/browse', {
            pageTitle: 'Skyreach - Logbook',
            title: 'Logbook',
            subTitle: '',
            path: '/members/skydives/browse',
            isMember: true, 
            skydives: jumps,
            isShared: member.logbook.isShared,
            userId: member.id,
            memberCountryCode: member.address.countryCode
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500);
    }
}

exports.getSharedLoogbookPage = async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        res.status(404).redirect('/page-not-found');
    }

    const user  = await userService.GetUserById(id);

    if (!user || !user.logbook.isShared) {
        res.status(404).redirect('/page-not-found');
    }

    const skydives = await skydiveService.GetSkydives({"owner": id}, {"sort": "-number"});

    res.status(200).render('members/skydives/browse', {
        pageTitle: 'Logbook',
        title: 'Logbook',
        subTitle: user.name,
        path: '/members/skydives/browse',
        isMember: false,
        skydives: skydives,
        userId: user.id
    });
}

exports.getDetailsPage = async (req, res) => {
    try {
        const skydiveId  = req.params.id;
        const token      = req.cookies['x-access-token'];
        const user       = await userService.GetUserFromToken(token);
        const skydive    = await skydiveService.GetSkydiveById(skydiveId);
        const discipline = await disciplineService.GetDisciplineByAbbr(skydive.stats.discipline);
    
        res.status(200).render('members/skydives/jumpItem', {
            pageTitle: 'Skyreach - View Item',
            subTitle: user.name,
            path: '/members/skydives/view',
            isMember: true,
            skydive: skydive,
            discipline: discipline,
            memberCountryCode: user.address.countryCode
        });

    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

exports.getSharedDetailsPage = async (req, res) => {
    const skydiveId = req.params.skydiveId;
    const memberId  = req.params.userId;

    try {
        if (!skydiveId || !memberId) {
            return res.status(404).redirect('/page-not-found');
        }
    
        const user       = await userService.GetUserById(memberId);
        const skydive    = await skydiveService.GetSkydiveById(skydiveId);
        const discipline = await disciplineService.GetDisciplineByAbbr(skydive.stats.discipline);
    
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
    const user = await userService.GetUserFromToken(req.cookies);
    const imports = await Import.find({"owner": user.id, "flags.isImported": false});

    res.status(200).render('members/skydives/import', {
        pageTitle: 'Import Skydives',
        title: 'Import',
        path: '/members/skydives/import',
        imports: imports
    });
}

exports.registerJump = async (req, res, next) => {
    try {
        let token = req.cookies["x-access-token"];

        if (!token) {
            throw new Error("Error caused by access token");
        }
    
        const member = await userService.GetUserFromToken(token);
        const skydive = skydiveService.RegisterSkydive(member.id, req.body);

        res.status(201).redirect('/members/skydives/browse');
    } catch (err) {
        console.log(err);
        return res.status(500);
        
    }  
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