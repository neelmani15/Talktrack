const mongoose = require('mongoose');

const meetingRecordSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  meetingId: {
    type: String,
    required: true
  },
  videoS3url: {
    type: String,
    required: true
  }
});

const Meeting = mongoose.model('Meeting', meetingRecordSchema);

module.exports = Meeting;