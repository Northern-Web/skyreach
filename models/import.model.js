const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var ImportSchema = new mongoose.Schema({
  originalFileName: {
    type: String,
    required: true,
    trim: true,
  },
  generatedFileName: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    required: true
  },
  gcsPath: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  flags: {
    isValidated: {
        type: Boolean,
        default: false
    },
    isImported: {
        type: Boolean,
        default: false
    }
  }

});

ImportSchema.plugin(timestamp);

var Import = mongoose.model('Import', ImportSchema);
module.exports = { Import };