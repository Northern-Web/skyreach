const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

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
    }
  }

});

UserSchema.plugin(timestamp);

var User = mongoose.model('User', UserSchema);
module.exports = { User };