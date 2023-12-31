const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var AircraftSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true
  },
  img: {
    publicUrl: {
        type: String,
        trim: true
    },
    authenticatedUrl: {
      type: String,
      trim: true
    },
    folder: {
      type: String,
      trim: true
    },
    fileName: {
      type: String,
      trim: true
    },
    credit: {
        type: String,
        trim: true
    },
    creditUrl: {
        type: String,
        trim: true
    }
  },
  maxAltitude: {
    type: Number
  },
  capacity: {
    type: Number
  },
  climbDuration: {
    type: Number
  },
  engine: {
    type: String
  },
  altitudeDefinition: {
    type: String,
    trim: true
  },
  nationalOrigin: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  }

});

AircraftSchema.plugin(timestamp);

var Aircraft = mongoose.model('Aircraft', AircraftSchema);
module.exports = { Aircraft };