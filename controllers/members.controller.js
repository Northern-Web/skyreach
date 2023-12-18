const { User }    = require('./../models/user.model');
const { Country } = require('./../models/country.model');
const jwt      = require("jsonwebtoken");

exports.getDashboardPage = async (req, res, next) => {
    res.status(200).render('members/dashboard', {
      pageTitle: 'Skyreach - Dashboard',
      path: '/members/dashboard'
    });
}

exports.getProfilePage = async (req, res, next) => {
  let token = req.cookies["x-access-token"];
  if (!token) {
      return res.status(404).redirect('/page-not-found');
  }

  var decoded    = await jwt.verify(token, process.env.JWT_SECRET);
  var user       = await User.findById(decoded.id);
  var countries  = await Country.find({"isActive": true});

  res.status(200).render('members/profile/details', {
      pageTitle: 'Skyreach - Profile',
      path: '/members/profile/',
      user: user,
      countries: countries
  });
}