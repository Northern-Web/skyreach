const UserService = require("./user.service");
const bcrypt      = require("bcryptjs");
const moment      = require("moment");
const jwt         = require("jsonwebtoken");

const userService = new UserService();

class AuthService {
    constructor () {

    }

    async Login (body) {
        const { email, password } = body;

        // Check for missing fields
        if (!email || !password) {
            throw new Error('Missing input fields.');
        }

        // Check if user exists
        var user = await userService.GetUserByEmail(email);
        if (!user) {
            throw new Error('User already exists.');
        }

        // Check if password is valid
        var isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Incorrect password');
        }

        // Check if account is active
        if (!user.account.isActive) {
            throw new Error('User account has been suspended');
        }

        const token = await this.GenerateToken(user);

        user.account.lastLogin = moment();
        user.save();

        return token;
    }

    async GenerateToken (user) {
        return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY_TIME,
        });
    }

    async GetCookieOptions () {
        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
          }
          return options;
    }
}
module.exports = AuthService;