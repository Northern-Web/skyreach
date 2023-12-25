const { User } = require('../models/user.model');
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");

class UserService {

    constructor () {
        
    }

    async GetUserByEmail (email) {
        return await User.findOne({ 'email': email });
    }

    static async GetUserFromToken (cookies) {
    let token = cookies["x-access-token"];

    if (!token) {
        throw new Error('User not found');
    }

    const decoded  = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    return user;
    }

    async CreateUser (body) {
        const { name, email, password, streetname1, streetname2, region, 
            zipCode, city, country, tosOptin, marketingOptin } = body;
        
        // Check that required fields are present
    if (!name || !email || !password || !streetname1 || !region || !zipCode || !city || !country) {
        throw new Error('Please add all required fields.');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
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

}

module.exports = UserService;