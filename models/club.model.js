const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  logoUrl: {
    type: String,
    trim: true
  },
  location: {
    streetName1: {
        type: String,
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
        trim: true
    },
    city: {
        type: String,
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
    },
    coordinates: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    }
  },
  contactInfo: {
    websiteUrl: {
        type: String,
        trim: true
    },
    facebookUrl: {
        type: String,
        trim: true
    },
    instagramUrl: {
        type: String,
        trim: true
    },
    youtubeUrl: {
        type: String,
        trim: true
    },
  }

});

ClubSchema.plugin(timestamp);

var Club = mongoose.model('Club', ClubSchema);
module.exports = { Club };