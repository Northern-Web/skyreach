const { Aircraft } = require('./../models/aircraft.model');

class AircraftService {
    constructor () {

    }

    async GetAircrafts (query, options) {
        return await Aircraft.find(query).setOptions(options);
    }

    async GetAircraftById (id) {
        if (!id) {
            throw new Error('No Aircraft ID was provided. Unable to get aircraft.');
        }
        return await Aircraft.findById(id);
    }
}
module.exports = AircraftService;