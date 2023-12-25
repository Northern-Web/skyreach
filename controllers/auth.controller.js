const AuthService = require('./../services/auth.service');
const asyncHandler = require("express-async-handler");

const authService = new AuthService();

exports.loginUser = asyncHandler(async (req, res) => {
    try {
        const token = await authService.Login(req.body);
        res.cookie('x-access-token',token, await authService.GetCookieOptions()) 
        res.status(200).redirect('/members/dashboard');

    } catch (err) {
        console.log(err);
        return res.status(400).redirect('/login?failedAttempt=true');
    }

});

exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("x-access-token");
    res.status(200).redirect('/');
});