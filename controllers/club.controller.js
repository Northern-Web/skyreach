const ClubService    = require('./../services/club.service');
const CountryService = require('./../services/country.service');
const UserService    = require('./../services/user.service');

const clubService    = new ClubService();
const countryService = new CountryService();
const userService    = new UserService();

exports.getClubOverviewPage = async (req, res) => {
    const countryCode = req.params.countryCode;
    const token = req.cookies['x-access-token'];
    const member = await userService.GetUserFromToken(token);
    const activeCountries = await countryService.GetCountries({"isActive": true}, {"sort": "name"});
    const clubs = await clubService.GetClubs({ "location.countryCode": countryCode}, {"sort": "name"});

    res.status(200).render('members/clubs/browse', {
        pageTitle: 'Skyreach - Clubs',
        path: '/members/clubs/browse',
        clubs: clubs,
        countries: activeCountries,
        memberCountryCode: member.address.countryCode
      });
}
