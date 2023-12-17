const { Aircraft } = require('./../models/aircraft.model');

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