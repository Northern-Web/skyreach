const UserService    = require('./../services/user.service');
const SkydiveService = require('./../services/skydive.service');
const { Country }    = require('./../models/country.model');
const config         = require('./../config/index');

const userService = new UserService();
const skydiveService = new SkydiveService();

exports.getDashboardPage = async (req, res, next) => {
  let token = req.cookies["x-access-token"];
  var user      = await userService.GetUserFromToken(token);

    const stats = await skydiveService.GetDashboardStats(user);

    res.status(200).render('members/dashboard', {
      pageTitle: 'Skyreach - Dashboard',
      path: '/members/dashboard',
      stats: stats,
      memberCountryCode: user.address.countryCode
    });
}

exports.getProfilePage = async (req, res, next) => {
  let token = req.cookies["x-access-token"];
  if (!token) {
      return res.status(404).redirect('/page-not-found');
  }

  var user       = await userService.GetUserFromToken(token);
  var countries  = await Country.find({"isActive": true});

  res.status(200).render('members/profile/details', {
      pageTitle: 'Skyreach - Profile',
      path: '/members/profile/',
      user: user,
      countries: countries,
      memberCountryCode: user.address.countryCode,
      baseUrl: config.app.baseUrl
  });
}