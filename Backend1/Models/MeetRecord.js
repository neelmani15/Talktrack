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
  orderedSpeaker:{
    type:Array,
    required:true
  },
  videoS3url: {
    type: String,
    required:true,
    default:''
  },
  transcript: {
    type: String,
    default:''
  },
  transcriptionData: {
    type: JSON,
    required:true,
    default:{}
  },
  assemblytranscritps: {
    type: JSON,
    required:true,
    default:{}
  },
  orderSpeakerTimeBasis:{
    type:Array,
    required:true
  },
  meetingStartTime:{
    type:Date,
    required:true
  },
  mappedTranscript: {
    type: Array,
    required: true
  }

});

const Meeting = mongoose.model('Meeting', meetingRecordSchema);

module.exports = Meeting;
