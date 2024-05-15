const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    googleAccessToken: {
        type:String,
        required:true
    },
    events: [{
        summary: String,
        description: String,
        start:Date,
        end:Date,
        // start: {
        //     dateTime: { type: String, required: true }
        // },
        // end: {
        //     dateTime: { type: String, required: true }
        // },
        url: String,
        // attendees: [String]
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;