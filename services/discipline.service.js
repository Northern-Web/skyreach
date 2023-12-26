const { Discipline } = require('./../models/discipline.model');


class DisciplineService {
    constructor () {

    }

    async GetDisciplines (query, options) {
        return await Discipline.find(query).setOptions(options);
    }

    async GetDisciplineByAbbr (abbr) {
        return await Discipline.findOne({"abbreviation": abbr});
    }
}
module.exports = DisciplineService;