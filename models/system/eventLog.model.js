const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var EventLogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    trim: true
  },
  isError: {
    type: Boolean,
    required: true,
    default: false
  },
  user: {
    type: String,
    required: true,
    default: 'System',
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    day: {
      type: Number
    },
    hour: {
      type: Number
    },
    minutes: {
      type: Number
    }
  }
  
});

EventLogSchema.plugin(timestamp);

var EventLog = mongoose.model('EventLog', EventLogSchema);
module.exports = { EventLog };