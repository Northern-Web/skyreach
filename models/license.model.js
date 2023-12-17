const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var LicenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  abbr: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

LicenseSchema.plugin(timestamp);

var License = mongoose.model('License', LicenseSchema);
module.exports = { License };