const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  isoCode: {
    type: String,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  }

});

CountrySchema.plugin(timestamp);

var Country = mongoose.model('Country', CountrySchema);
module.exports = { Country };