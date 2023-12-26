const AircraftService = require('./../services/aircraft.service');
const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./gcs_service_account.json" });
const publicBucket = storage.bucket("skyreach-public-assets");

const aircraftService = new AircraftService();

exports.getOverviewPage = async (req, res, next) => {
    const aircrafts = await aircraftService.GetAircrafts({"isActive": true}, {"sort": "manufacturer"});

    res.status(200).render('members/aircrafts/overview', {
        pageTitle: 'Skyreach - Aircrafts',
        path: '/members/aircrafts/overview',
        aircrafts: aircrafts
    });
}

exports.getDetailsPage = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(404).redirect('/page-not-found');
    }

    const aircraft = await aircraftService.GetAircraftById(id);

    if (!aircraft) {
        return res.status(404).redirect('/page-not-found');
    }

    res.status(200).render('members/aircrafts/details', {
        pageTitle: 'Skyreach - Aircraft details',
        path: '/members/aircrafts/id',
        aircraft: aircraft
    });

}

exports.createAircraft = async (req, res) => {
    const { manufacturer, model, maxAltitude, capacity, climbDuration, engine,
            altitudeDefinition, nationalOrigin
    } = req.body;

    try {
        await processFile(req, res);
        
    } catch (err) {

    }
}