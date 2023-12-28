const { Club } = require('./../models/club.model');

class ClubService {
    constructor () {

    }

    async GetClubs (query, options) {
        return await Club.find(query).setOptions(options);
    }

    async GetClubById (id) {
        if (!id) {
            throw new Error('No Club ID was provided. Unable to retreive club data.');
        }
        return await Club.findById(id);
    }
}
module.exports = ClubService;