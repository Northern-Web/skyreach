const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');
const jwt       = require("jsonwebtoken");
require("dotenv").config();


var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  address: {
    streetName1: {
        type: String,
        required: true,
        trim: true
    },
    streetName2: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    countryCode: {
        type: String,
        required: true,
        trim: true
    }
  },
  logbook: {
    isShared: {
        type: Boolean,
        required: true,
        default: false
    }
  },
  account: {
    isActive: {
        type: Boolean,
        default: true
    },
    trialPeriodEnd: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Moderator', 'Admin'],
        default: 'User'
    },
    lastLogin: {
      type: Date
    },
    consents: {
      termsOfService: {
        isAccepted: {
          type: Boolean,
          required: true
        },
        dateChanged: {
          type: Date
        }
      },
      marketing: {
        isAccepted: {
          type: Boolean,
          required: true
        }
      }
    }
  }
});

UserSchema.plugin(timestamp);

UserSchema.methods.tokenGenerator = async function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY_TIME,
  });
};

UserSchema.methods.getCookieOptions = async function () {
  let options = {
    path:"/",
    sameSite:true,
    maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
    httpOnly: true, // The cookie only accessible by the web server
  }
  return options;
}

var User = mongoose.model('User', UserSchema);
module.exports = { User };