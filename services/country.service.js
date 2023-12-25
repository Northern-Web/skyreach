const { Country } = require("./../models/country.model");

class CountryService {
    constructor () {

    }

    async GetCountryByName (name) {
        return await Country.find({"name": name});
    }

    async GetCountryByCode (isoCode) {
        return await Country.find({"isoCode": isoCode});
    }

    async GetCountries (query, options) {
        return await Country.find(query).setOptions(options);
    }

    async CreateCountry (data) {
        const [ name, isoCode, imgUrl ] = data;

        var country = new Country({
            "name": name,
            "isoCode": isoCode,
            "imgUrl": imgUrl
        });

        country.save();
        return country;
    }

    async UpdateCountry (id, data) {
        if (!id || !data) {
            throw new Error('Unable to update country');
        }
        return await Country.findByIdAndUpdate({ '_id': id}, data);
    }

    async DeleteCountry (id) {
        if (!id) {
            throw new Error('Unable to delete country.');
        }
        return await Country.findByIdAndDelete(id);
    }
}
module.exports = CountryService;