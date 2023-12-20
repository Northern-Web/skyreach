const { Aircraft } = require('./../models/aircraft.model');
const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./gcs_service_account.json" });
const publicBucket = storage.bucket("skyreach-public-assets");

exports.getOverviewPage = async (req, res, next) => {
    const aircrafts = await Aircraft.find({"isActive": true});

    res.status(200).render('members/aircrafts/overview', {
        pageTitle: 'Skyreach - Aircrafts',
        path: '/members/aircrafts/overview',
        aircrafts: aircrafts
    });
}

exports.getDetailsPage = async (req, res, next) => {
    const id = req.params.id;

    if (!id) {
        return res.status(404).redirect('/page-not-found');
    }

    const aircraft = await Aircraft.findById(id);

    if (!aircraft) {
        return res.status(404).redirect('/page-not-found');
    }

    res.status(200).render('members/aircrafts/details', {
        pageTitle: 'Skyreach - Aircraft details',
        path: '/members/aircrafts/id',
        aircraft: aircraft
    });

}

exports.createAircraft = async (req, res, next) => {
    const { manufacturer, model, maxAltitude, capacity, climbDuration, engine,
            altitudeDefinition, nationalOrigin
    } = req.body;

    try {
        await processFile(req, res);
        
    } catch (err) {

    }
}