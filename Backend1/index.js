const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const DBConnection = require('./Connection/db.js');
const axios = require('axios');
// const puppeteer = require('puppeteer');
const User = require('./Models/userSchema.js');
// const URL = require('url');
const puppeteerScreenRecorder = require('puppeteer-screen-recorder');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const fs = require('fs');
const  OpenAIApi  = require('openai');
// const AudioRecorder = require('node-audiorecorder');
const cron = require('node-cron');
const { parseISO, subMinutes, addMinutes, isAfter,isBefore } = require('date-fns');
const PuppeteerScreenRecorder = require('puppeteer-screen-recorder');
// const RecordRTC = require('recordrtc');

const { launch, getStream,wss } = require("puppeteer-stream");
const { log } = require('console');


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

const calendar = google.calendar({
    version:"v3",
    auth:process.env.API_KEY
})

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_URL
);

const scopes = [
    "email",
    "profile",
    'https://www.googleapis.com/auth/calendar'
  ];

app.get('/auth/google',(req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    // const myUrl = new URL(url); 
    // res.redirect(myUrl);
    res.redirect(url);
});

app.get('/auth/google/callback',async (req,res)=>{
    // console.log(req.query);
    try{
        const code = req.query.code;
        const {tokens}= await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // console.log(oauth2Client);
    
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
    
        await User.findOneAndUpdate({ googleId: data.id }, {
            googleId: data.id,
            email: data.email,
            displayName: data.name,
            googleAccessToken:tokens.access_token
        }, { upsert: true });
        console.log(data);
        
        // res.status(200).json({ message: 'User Login successfully.' });
        res.redirect('http://localhost:3000/login/success');
        // const user_info = await axios.get(https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token})
        // console.log(user_info);
        // res.send({
        //     message:"You have successfully logged in"
        // })
    }catch(err){
        console.log("Error in Login",err);
        res.status(404).json({ message: 'Unable to Register User'});
    }
});


const uploadToS3 = require('.//Connection/uploadToS3');
const { trusted } = require('mongoose');

// case -2 working and storing the video
async function stopRecording(browser, stream, fileStream,meetingId) {
    try {
        stream.unpipe(fileStream);
        fileStream.end();
        console.log("Recording stopped successfully.");
        // const s3Url = await uploadToS3(fileStream.path, 'riktam-recordings',meetingId);
        // console.log(s3Url)
        // isRecordingStopped=true
        await browser.close();
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

// Function to check bot presence and handle "Got it" button
let gotItClicked = false;
let isRecordingStopped=false

async function checkBotPresence(page, browser, stream, fileStream,meetingId) {
    try {
        const botName = 'riktam.ai NoteTaker'; // Adjust this to match the bot's name
        if (isRecordingStopped) {
            return true;
        } else {
            const frame = page.mainFrame();
            if (!frame.isDetached()) {
                const { participants, leftMeetingText } = await frame.evaluate(() => {
                    const leftMeetingElement = document.querySelector('h1[jsname="r4nke"].roSPhc');
                    const leftMeetingText = leftMeetingElement ? leftMeetingElement.textContent : null;
                    const participants = [];
                    const participantElements = document.querySelectorAll('div.dwSJ2e');
                    participantElements.forEach(participant => {
                        participants.push(participant.innerText);
                    })
                    return { participants, leftMeetingText };
                });

                console.log('Participants:', participants);
                console.log('Meeting status:', leftMeetingText);

                if (leftMeetingText) {
                    await stopRecording(browser, stream, fileStream,meetingId);
                    return;
                }

                if (participants.length >= 1) {
                    if (!gotItClicked) {
                        await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
                        console.log('Clicked on "Got it" button');
                        gotItClicked = true;
                    }
                }

                if (participants.length === 1) {
                    gotItClicked = false;
                    await stopRecording(browser, stream, fileStream,meetingId);
                    return;
                }
            }
        }
    } catch (error) {
            console.error('Error checking bot presence:', error);
            await stopRecording(browser, stream, fileStream);
    }
}

function dateToCron(date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-indexed value
    const dayOfWeek = '*'; // Schedule to run on any day of the week
    return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

app.post("/schedule-event", async (req, res) => {
    console.log(req.body.formData);

    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${oauth2Client.credentials.access_token}`
        }
    });

    const attendeesEmails = [
        { 'email': 'neelmani242@gmail.com' },
    ];

    const user = await User.findOne({ googleId: data.id });

    const event = {
        summary: req.body.formData.summary,
        location: 'Virtual / Google Meet',
        description: req.body.formData.description,
        start: {
            dateTime: req.body.formData.startTime,
        },
        end: {
            dateTime: req.body.formData.endTime,
        },
        attendees: attendeesEmails,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', 'minutes': 24 * 60 },
                { method: 'popup', 'minutes': 10 },
            ],
        },
        conferenceData: {
            createRequest: {
                conferenceSolutionKey: {
                    type: 'hangoutsMeet'
                },
                requestId: 'coding-calendar-demo'
            }
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            resource: event,
            conferenceDataVersion: 1
        });

        const summary = response.data.summary;
        const description = response.data.description;
        const location = response.data.location;
        const scheduleStartTime = response.data.start.dateTime;
        const scheduleEndTime = response.data.end.dateTime;
        const meetinglink = response.data.hangoutLink;

        const alldata = {
            summary: summary,
            description: description,
            start: scheduleStartTime,
            end: scheduleEndTime,
            url: meetinglink,
        };

        user.events.push(alldata);
        await user.save();

        // Schedule the bot to join 5 minutes before the meeting start time
        // const startTime = parseISO(scheduleStartTime);
        // const endTime = parseISO(scheduleEndTime);
        // const botJoinTime = subMinutes(startTime, 4);
        // console.log(botJoinTime);
        // const cronTime = dateToCron(botJoinTime);
        // console.log(cronTime);

        // cron.schedule(cronTime, async () => {
        //     await joinMeeting(meetinglink, startTime);
        // });

        const startTime = parseISO(scheduleStartTime);
        const endTime = parseISO(scheduleEndTime);
        const botJoinTime = subMinutes(startTime, 5);
        const interval = 1 * 60 * 1000; // 1 minutes in milliseconds

        let joined = false;

        const checkAndJoinMeeting = async () => {
            if (joined) {
                clearInterval(intervalId);
                joined=false;
                return;
            }
            const now = new Date();
            if (isAfter(now, startTime) && isBefore(now, endTime)) {
                joined = await joinMeeting(meetinglink, startTime);
                if (joined) {
                    clearInterval(intervalId);
                    joined=false;
                }
            } else if (isAfter(now, endTime)) {
                clearInterval(intervalId);
                joined=false;
            }
        };

        const intervalId = setInterval(checkAndJoinMeeting, interval);

        console.log(`📅 Calendar event created: ${summary}at ${location}, from ${scheduleStartTime} to ${scheduleEndTime}, \n 💻 Join conference call link: ${meetinglink}`);
        res.send({
            message: "Event Added"
        });
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response && error.response.data) {
            console.error("Google Calendar API error:", error.response.data);
            res.status(404).json({ message: 'Google Calendar API Error.' });
        } else {
            res.status(404).json({ message: 'Unable to add the Event' });
        }
    }
});

async function joinMeeting(meetUrl, meetingStartTime) {
    console.log("Joining Meet");
    // const { meetUrl } = req.body;
    console.log(meetUrl);

    const parts = meetUrl.split('/');
const meetingId = parts[parts.length - 1];
const file = fs.createWriteStream("./report/test5.mp4");

console.log(meetingId);

    try {
        puppeteer.use(StealthPlugin());
        const browser = await launch(puppeteer, {
            defaultViewport: null,
            headless: true,
            devtools: false,
            args: [
                "--autoplay-policy=no-user-gesture-required",
            ],
            executablePath: executablePath(),
        });
        const page = (await browser.pages())[0];
        
        // Define the path for storing the recorded file
        // const filePath = './report/video/meeting_recording.webm';
        const filePath = `./report/video/meetingId_${meetingId}.webm`;
        console.log(filePath)
        const fileStream = fs.createWriteStream(filePath);
        
        // Get the media stream
        const stream = await getStream(page, { audio: true, video: true });
        // stream.pipe(fileStream);
        stream.pipe(file);

        const navigationPromise = page.waitForNavigation();
        const context = browser.defaultBrowserContext();
        await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);
        
        await page.goto(meetUrl, { waitUntil: "networkidle0", timeout: 120000 });
        await navigationPromise;

        await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 50000 });
        console.log('Name input found');
        await page.type('input[aria-label="Your name"]', 'riktam.ai NoteTaker');

        try {
            const cameraButtonSelector = '[aria-label*="Turn off camera"]';
            const microphoneButtonSelector = '[aria-label*="Turn off microphone"]';
            
            await page.waitForSelector(cameraButtonSelector, { visible: true, timeout: 60000 });
            console.log('Camera button found');
            await page.click(cameraButtonSelector);
            console.log('Camera turned off');
            
            await page.waitForSelector(microphoneButtonSelector, { visible: true, timeout: 60000 });
            console.log('Microphone button found');
            await page.click(microphoneButtonSelector);
            console.log('Microphone turned off');

        } catch (err) {
            console.error('Error turning off camera/microphone:', err);
        }

        const askToJoinButtonSelector = 'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]';
        await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 50000 });
        console.log('Ask to join button found');
        await page.click(askToJoinButtonSelector);
        console.log('Clicked on Ask to join button');

        page.on('framenavigated', async (frame) => {
            const url = frame.url();
            console.log(url);
            if (!url.includes('meet.google.com')) {
                console.log("Meeting Stopped");
                await stopRecording(browser, stream, fileStream,meetingId);
                return
            }
        });

        setInterval(async () => {
           let answer=await checkBotPresence(page, browser, stream, fileStream,meetingId);
           if (answer){
            stop=true
            return
           }
        }, 10000);
        return true;

        // res.status(200).json({ message: 'Recording started successfully.' });

    } catch (error) {
        console.error('Error starting recording:', error);
        return false;
        // res.status(500).json({ error: 'An error occurred while starting recording.' });
    }
}
    // while (isBefore(new Date(), waitUntil)) {
    //     const meetingStarted = await checkMeetingStatus(page);
    //     if (meetingStarted) {
    //         console.log("Meeting has started");
    //         return;
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds before checking again
    // }

    // console.log("Meeting did not start within 15 minutes");
    // await browser.close();


async function checkMeetingStatus(page) {
    try {
        const joinButton = await page.$('button[class*="VfPpkd-LgbsSe"]');
        return !joinButton;
    } catch (error) {
        console.error('Error checking meeting status:', error);
        return false;
    }
}

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

// audioFun()
app.get('/allevents', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${oauth2Client.credentials.access_token}`
            }
        });

        const user = await User.findOne({ googleId: data.id });

        // Check if user exists and has events
        if (user && user.events.length > 0) {
            // Initialize the list to store all events
            var alleventslist = [];

            // Iterate through each event and add it to the list
            user.events.forEach(event => {
                alleventslist.push(event);
            });

            // Send the list of all events to the frontend
            // res.json(alleventslist);
            res.status(200).json({ message: 'All Events are listed',alleventslist });
        } else {
            res.status(404).json({ message: 'User not found or no events found for the user.' });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(Port,()=>{
    DBConnection();
    console.log(`Server is running on ${Port}`);
});