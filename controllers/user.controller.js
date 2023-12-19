const { User }    = require('./../models/user.model');
const { Country } = require('./../models/country.model');
const jwt         = require("jsonwebtoken");
const { zip } = require('lodash');

exports.updateUserAddress = async (req, res, next) => {
    const { streetname1, streetname2, region, zipcode, city, country } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        return res.status(404).redirect('/page-not-found');
    }
    var decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    const selectedCountry = await Country.findOne({"isoCode": country});

    var newAddress = {
        "streetName1": streetname1,
        "streetName2": streetname2,
        "region":      region,
        "zipCode":     zipcode,
        "city":        city,
        "country":     selectedCountry.name,
        "countryCode": selectedCountry.isoCode
    }

    user.address = newAddress;
    user.save();
    res.status(200).redirect('/members/profile');

}

exports.toggleLogbookSharing = async (req, res, next) => {
    const { isLogbookShared } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        return res.status(404).redirect('/page-not-found');
    }
    const decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);

    var newLogbook = {
        "isShared": (isLogbookShared) ? true : false
    }

    user.logbook = newLogbook;
    user.save();
    setTimeout(() => {
        console.log("Delay of 0,2 sec applied.");
    }, 200);
    res.status(200).redirect('/members/profile');
}