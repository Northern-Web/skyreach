exports.getDashboardPage = async (req, res, next) => {
    res.status(200).render('members/dashboard', {
      pageTitle: 'Skyreach',
      path: '/members/dashboard'
    });
}