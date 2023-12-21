const { User } = require('./../models/user.model');
const jwt      = require("jsonwebtoken");

class UserService {

    static async GetUserFromToken (cookies) {
    let token = cookies["x-access-token"];

    if (!token) {
        return res.status(404).redirect('/page-not-found');
    }
    const decoded  = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    return user;
    }

}

module.exports = { UserService };