const mongoose  = require('mongoose');
const timestamp = require('mongoose-timestamp');

var JumpSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  aircraft: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    country: {
        type: String,
        trim: true
    },
    country_code: {
        type: String,
        trim: true
    },
    dropzone: {
        type: String,
        trim: true
    }
  },
  stats: {
        altitude: {
            type: Number,
            required: true
        },
        freefalltime: {
            type: Number,
            required: true
        },
        discipline: {
            type: String,
            required: true,
            trim: true
        },
        isEmergencyProcedure: {
            type: Boolean,
            required: true,
            default: false
        },
        isLineTwist: {
            type: Boolean,
            required: true,
            default: false
        },
        isProgressionJump: {
            type: Boolean,
            required: true,
            default: false
        },
        isProgressionJumpApproved: {
            type: Boolean
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    attestant: {
        name: {
            type: String,
            trim: true
        },
        license: {
            type: String,
            trim: true
        },
        remark: {
            type: String,
            trim: true
        }
    },
    owner: {
        type: String,
        required: true,
        trim: true
    }
});

JumpSchema.plugin(timestamp);

var Jump = mongoose.model('Jump', JumpSchema);
module.exports = { Jump };