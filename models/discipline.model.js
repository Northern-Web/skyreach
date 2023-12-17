const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var DisciplineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

DisciplineSchema.plugin(timestamp);

var Discipline = mongoose.model('Discipline', DisciplineSchema);
module.exports = { Discipline };