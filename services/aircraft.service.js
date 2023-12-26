const { Aircraft } = require('./../models/aircraft.model');

class AircraftService {
    constructor () {

    }

    async GetAircrafts (query, options) {
        return await Aircraft.find(query).setOptions(options);
    }
}
module.exports = AircraftService;