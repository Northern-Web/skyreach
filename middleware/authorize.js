const jwt = require("jsonwebtoken");
const { User } = require("./../models/user.model");
require("dotenv").config();

verifyToken = (req, res, next) => {
    let token = req.cookies["x-access-token"];

    // Check if token is present
    if (!token) {
        return res.status(401).redirect('/login');
    }

    jwt.verify(token, 
        process.env.JWT_SECRET,
        (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/login');
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user.account.role === "Admin") {
            next();
            return;
        }
  
    res.status(403).redirect('/dashboard')
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user.account.role === "Admin") {
            next();
            return;
        }
  
    res.status(403).redirect('/dashboard')
    });
};

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        if (user.account.role === "Moderator") {
            next();
            return;
        }
  
        if (user.account.role === "Admin") {
            next();
            return;
        }
        
    res.status(403).redirect('/dashboard');
    });
  };

  const authorize = {
    verifyToken: verifyToken,
    isAdmin:     isAdmin,
    isModeratorOrAdmin: isModeratorOrAdmin
  };
  module.exports = authorize;