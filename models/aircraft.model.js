const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var AircraftSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  model: {
    type: String,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String,
    trim: true
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