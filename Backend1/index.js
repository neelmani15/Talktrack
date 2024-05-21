const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const DBConnection = require('./Connection/db.js');
const axios = require('axios');

const fs = require('fs');
const  OpenAIApi  = require('openai');

dotenv.config()

const app = express();
const Port = process.env.PORT || 5001;

app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Hello, Welcome to TalkTrack Backend!');
});


const userRouter= require("./Routes/user")
const OAuthRouter= require("./Routes/oauth")
app.use("/user",userRouter)
app.use("/auth",OAuthRouter)

const cookieOptions = {
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)
    sameSite: 'None', // Allows the cookie to be sent with cross-origin requests
    httpOnly: false // Allows the cookie to be accessed via JavaScript
  };


const openai = new OpenAIApi({
    apikeys_v2:process.env.OPENAI_API_KEY
});

const audioFun = async()=>{
    const transcription = await openai.audio.transcriptions.create({
        // file:fs.createReadStream("./audio/audio.mp3"),
        file:fs.createReadStream("./report/test4.mp4"),
        // file:fs.createReadStream('https://riktam-recordings.s3.ap-south-1.amazonaws.com/recorded_video_MeetingId_bqu-ehua-ttt.webm'),
        model:"whisper-1",
        language: "en"
    })
    console.log(transcription);
}

app.listen(Port,()=>{
    DBConnection();
    console.log(`Server is running on ${Port}`);
});

