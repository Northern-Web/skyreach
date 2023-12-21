const { User }    = require('./../models/user.model');
const { Country } = require('./../models/country.model');
const { SkydiveService } = require('./../services/skydiveService');
const jwt         = require("jsonwebtoken");
require("dotenv").config();

exports.getDashboardPage = async (req, res, next) => {
  let token = req.cookies["x-access-token"];
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  var user      = await User.findById(decoded.id);

    const stats = await SkydiveService.GetDashboardStats(user);
    console.log(stats);

    res.status(200).render('members/dashboard', {
      pageTitle: 'Skyreach - Dashboard',
      path: '/members/dashboard',
      stats: stats
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
      countries: countries,
      baseUrl: process.env.BASE_URL
  });
}