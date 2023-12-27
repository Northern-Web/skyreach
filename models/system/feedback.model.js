const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  requester: {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    identifier: {
        type: String,
        required: true,
        trim: true
    }
  },
  isClosed: {
    type: Boolean,
    default: false
  }

  
});

FeedbackSchema.plugin(timestamp);

var Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = { Feedback };