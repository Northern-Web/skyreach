const { User }     = require("./../models/user.model");
const { Country }  = require("./../models/country.model");
const { EventLog } = require("./../models/system/eventLog.model");
const asyncHandler = require("express-async-handler");
const jwt          = require("jsonwebtoken");
const bcrypt       = require("bcryptjs");

exports.signup = asyncHandler(async (req, res) => {
    const { name, email, password, streetname1, streetname2, region, 
            zipCode, city, country, tosOptin, marketingOptin } = req.body;

    // Check that required fields are present
    if (!name || !email || !password || !streetname1 || !region || !zipCode || !city || !country) {
        res.status(400);
        throw new Error('Please add all required fields.');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
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
        "account.consents.marketing.isAccepted": (tosMarketing) ? true : false
    });

    var timestamp = new Date();

    try {
        await user.save();
        
        EventLog.create({
           "category":     'Account Creation',
           "description":  'A new account has been created!',
           "details":      `Account has been created with the e-mail of ${user.email}`,
           "user":         user.name,
           "resource":     'AuthController.SignUp',
           "time.year":    timestamp.getFullYear(),
           "time.month":   timestamp.getMonth(),
           "time.day":     timestamp.getDate(),
           "time.hour":    timestamp.getHours(),
           "time.minutes": timestamp.getMinutes()
        });
        res.status(201).redirect('/');
    } catch (err) {
        EventLog.create({
            "category":     'Account Creation',
            "description":  'Account creation failed',
            "details":      `Error: ${err}`,
            "isError":      true,
            "user":         'System',
            "resource":     'AuthController.SignUp',
            "time.year":    timestamp.getFullYear(),
            "time.month":   timestamp.getMonth(),
            "time.day":     timestamp.getDate(),
            "time.hour":    timestamp.getHours(),
            "time.minutes": timestamp.getMinutes()
         });
         res.status(400);
         throw new Error('Account creation failed.');
    }
})

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).redirect('/login?failedAttempt=true');
    }

    // Check if user exists
    var user = await User.findOne({"email": email});
    if (!user) {
        return res.status(404).redirect('/login?failedAttempt=true');
    }

    // Check if password is valid
    var isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).redirect('/login?failedAttempt=true');
    }

    // Check if account is active
    if (!user.account.isActive) {
        return res.status(400).redirect('/login?failedAttempt=true');
    }

    const token = await user.tokenGenerator();

    user.account.lastLogin = new Date();
    user.save();

    res.cookie('x-access-token',token, await user.getCookieOptions()) 
    res.status(200).redirect('/members/dashboard');

});

exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("x-access-token");
    res.status(200).redirect('/');
});