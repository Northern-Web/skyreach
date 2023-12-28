const { User }       = require('../models/user.model');
const CountryService = require('./country.service');
const bcrypt         = require("bcryptjs");
const jwt            = require("jsonwebtoken");
const config         = require('./../config/index');

const countryService = new CountryService();

class UserService {

    constructor () {
        
    }

    async GetUserByEmail (email) {
        return await User.findOne({ 'email': email });
    }

    async GetUserById (id) {
        if (!id) {
            throw new Error('Id not provided. Fetching user failed.');
        }
        return User.findById(id);
    }

    async GetUserFromToken (token) {
        if (!token) {
            throw new Error('User not found');
            return;
        }

        const decoded  = jwt.verify(token, config.authentication.jwtSecret);
        var user       = await User.findById(decoded.id);
        return user;
    }

    async CreateUser (body) {
        const { name, email, password, streetname1, streetname2, region, 
            zipCode, city, country, tosOptin, marketingOptin } = body;
        
        // Check that required fields are present
    if (!name || !email || !password || !streetname1 || !region || !zipCode || !city || !country) {
        throw new Error('Please add all required fields.');
        return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get country based in ISO Code
    const selectedCountry = await Country.findOne({"isoCode": country});

    // Establish trial period
    var date = new Date();
    var trialPeriod = date.setDate(date.getDate() + 30);

    // Create user
    var user = new User({
        "name": name,
        "email": email,
        "password": hashedPassword,
        "address.streetName1": streetname1,
        "address.streetName2": streetname2,
        "address.region": region,
        "address.zipCode": zipCode,
        "address.city": city,
        "address.country": selectedCountry.name,
        "address.countryCode": selectedCountry.isoCode,
        "account.trialPeriodEnd": trialPeriod,
        "account.consents.termsOfService.isAccepted": (tosOptin) ? true : false,
        "account.consents.termsOfService.dateChanged": date,
        "account.consents.marketing.isAccepted": (marketingOptin) ? true : false
    });

    var timestamp = new Date();
    return await user.save();

    }

    async UpdateUserLogbook (id, body) {
        if (!id || !body) {
            throw new Error('Invalid update request');
        }

        var newLogbook = {
            isShared: (body.isShared) ? true : false
        }

        body.logbook = newLogbook;

        return await User.findByIdAndUpdate(id, body);
    }

    async UpdateUserAddress (id, body) {
        if (!id || !body) {
            throw new Error('Invalid update request');
        }

        const { streetname1, streetname2, region, zipcode, city, country } = body;

        const selectedCountry = await countryService.GetCountryByCode(country);

        var address = {
            "streetName1": streetname1,
            "streetName2": streetname2,
            "region":      region,
            "zipCode":     zipcode,
            "city":        city,
            "country":     selectedCountry.name,
            "countryCode": selectedCountry.isoCode
        }

        return await User.findByIdAndUpdate(id, address);
    }

    async UpdateUserPassword (member, body) {
        if (!member || !body) {
            throw new Error('Unable to update password.');
        }

        const { currentPassword, newPassword, confirmNewPassword } = body;

        const isCurrentPasswordValid = bcrypt.compare(currentPassword, member.password);

        if (!isCurrentPasswordValid) {
            throw new Error('Current password did not match the recorded password.');
        }

        if (newPassword != confirmNewPassword) {
            throw new Error('New password did not match confirmation.');
        }

        return await User.findByIdAndUpdate(member.id, {"password": newPassword});
    }

}
module.exports = UserService;