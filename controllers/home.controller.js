const {Country} = require('./../models/country.model');

exports.getLandingPage = async (req, res, next) => {
    res.status(200).render('home/index', {
      pageTitle: 'Skyreach',
      path: '/'
    });
}

exports.getSignupPage = async (req, res, next) => {
    var permittedCountries = await Country.find({"isActive": true});

    res.status(200).render('home/signup', {
        pageTitle: 'Skyreach - Signup',
        path: '/signup',
        countries: permittedCountries
    });
}

exports.getLoginPage = async (req, res, next) => {
    res.status(200).render('home/login', {
        pageTitle: 'Skyreach - Sign in',
        path: '/login'
    });
}