const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const DBConnection = require('./Connection/db.js');
const axios = require('axios');
const OpenAI = require("openai");
const puppeteerScreenRecorder = require('puppeteer-screen-recorder');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const fs = require('fs');
// const AudioRecorder = require('node-audiorecorder');
const PuppeteerScreenRecorder = require('puppeteer-screen-recorder');
// const RecordRTC = require('recordrtc');

const { launch, getStream,wss } = require("puppeteer-stream");
const { log } = require('console');
// const ffmpeg = require('fluent-ffmpeg');
// const path = require('path');

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

const Meeting=require('./Models/MeetRecord.js');

const uploadToS3 = require('.//Connection/uploadToS3');
// const getAudio = require('.//Connection/getaudio');
const { trusted } = require('mongoose');

// case -2 working and storing the video
// async function stopRecording(browser, stream, fileStream,meetingId,userEmail) {
//     try {
//         stream.unpipe(fileStream);
//         fileStream.end();
//         console.log("Recording stopped successfully.");
//         const s3Url = await uploadToS3(fileStream.path, 'riktam-recordings',meetingId);
//         console.log(s3Url)
//         // const s3Url = await uploadToS3(fileStream.path, 'riktam-recordings',meetingId);
//         // console.log(s3Url)
//         // isRecordingStopped=true
//         const meetingRecord = new Meeting({
//             userEmail: userEmail,
//             meetingId: meetingId,
//             videoS3url: s3Url
//         });
        
//         // Save the meeting record to the database
//         await meetingRecord.save();
        
//         console.log("Meeting record saved successfully.");
        
//         await browser.close();
//         console.log("browser closed")
//         isRecordingStopped=true
        
//     } catch (error) {
//         console.error('Error stopping recording:', error);
//     }
// }

// // Function to check bot presence and handle "Got it" button
// let gotItClicked = false;
// let isRecordingStopped=false
// async function checkBotPresence(page, browser, stream, fileStream,meetingId,userEmail) {
//     try {
//         const botName = 'riktam.ai NoteTaker'; // Adjust this to match the bot's name
//         if (isRecordingStopped) {
//             return true;
//         } else {
//             const frame = page.mainFrame();
//             if (!frame.isDetached()) {
//                 const { participants, leftMeetingText } = await frame.evaluate(() => {
//                     const leftMeetingElement = document.querySelector('h1[jsname="r4nke"].roSPhc');
//                     const leftMeetingText = leftMeetingElement ? leftMeetingElement.textContent : null;
//                     const participants = [];
//                     const participantElements = document.querySelectorAll('div.dwSJ2e');
//                     participantElements.forEach(participant => {
//                         participants.push(participant.innerText);
//                     })
//                     return { participants, leftMeetingText };
//                 });

//                 console.log('Participants:', participants);
//                 console.log('Meeting status:', leftMeetingText);

//                 if (leftMeetingText) {
//                     await stopRecording(browser, stream, fileStream,meetingId,userEmail);
//                     return;
//                 }

//                 if (participants.length >= 1) {
//                     if (!gotItClicked) {
//                         await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
//                         console.log('Clicked on "Got it" button');
//                         gotItClicked = true;
//                     }
//                 }

//                 if (participants.length === 1) {
//                     gotItClicked = false;
//                     await stopRecording(browser, stream, fileStream,meetingId,userEmail);
//                     return;
//                 }
//             }
//         }
//     } catch (error) {
//         if (error instanceof puppeteer.errors.TargetCloseError) {
//             console.error('Target closed. Terminating gracefully.');
//             await stopRecording(browser, stream, fileStream);
//         } else {
//             console.error('Error checking bot presence:', error);
//         }
//     }
// }

// function dateToCron(date) {
//     const minutes = date.getMinutes();
//     const hours = date.getHours();
//     const dayOfMonth = date.getDate();
//     const month = date.getMonth() + 1; // getMonth() returns 0-indexed value
//     const dayOfWeek = '*'; // Schedule to run on any day of the week
//     return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
// }
// case -2 working and storing the video

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); 
// const GetTranscript = async(s3videourl)=>{
//     const transcription = await openai.audio.transcriptions.create({
//         // file:fs.createReadStream("./audio/audio.mp3"),
//         // file:fs.createReadStream("./report/test6.mp4"),
//         // file:fs.createReadStream("./report/test4.mp4"),
//         file:fs.createReadStream(s3videourl),
//         // file:fs.createReadStream('https://riktam-recordings.s3.ap-south-1.amazonaws.com/recorded_video_MeetingId_bqu-ehua-ttt.webm'),
//         model:"whisper-1",
//         language: "en"
//     })
//     console.log(transcription);
//     return transcription.text
// }
// // async function stopRecording(browser, stream, fileStream,meetingId,userEmail) {
// //     try {
// //         stop=true
// //         stream.unpipe(fileStream);
// //         fileStream.end();
// //         console.log("Recording stopped successfully.");
// //         const s3Url = await uploadToS3(fileStream.path, 'riktam-recordings',meetingId);
// //         console.log(s3Url)
// //         console.log(userEmail)
// //         const transcription= await GetTranscript(fileStream.path)
// //         const meetingRecord = new Meeting({
// //             userEmail: userEmail,
// //             meetingId: meetingId,
// //             videoS3url: s3Url,
// //             transcript:transcription
// //         });
        
// //         await meetingRecord.save();
        
// //         console.log("Meeting record saved successfully.");
// //         await browser?.close();
// //         console.log("browser closed")

// //         isRecordingStopped=true
        
// //     } catch (error) {
// //         console.error('Error stopping recording:', error);
// //     }
// // }

// // Function to check bot presence and handle "Got it" button


// async function stopRecording(browser, stream, fileStream, meetingId, userEmail) {
//     try {
//         stop = true;
//         stream.unpipe(fileStream);
//         fileStream.end();
//         console.log("Recording stopped successfully.");

//         const videoPath = fileStream.path;
//         const audioOutputDir = path.dirname(videoPath);

//         // Extract audio from the video file
//         const audioPath = await getAudio(videoPath, audioOutputDir);

//         // Upload the video file to S3
//         const s3Url = await uploadToS3(videoPath, 'riktam-recordings', meetingId);
//         console.log(s3Url);
//         console.log(userEmail);

//         // Get transcription from the audio file
//         const transcription = await GetTranscript(audioPath);

//         // Save meeting record to the database
//         const meetingRecord = new Meeting({
//             userEmail: userEmail,
//             meetingId: meetingId,
//             videoS3url: s3Url,
//             transcript: transcription
//         });

//         await meetingRecord.save();
//         console.log("Meeting record saved successfully.");

//         await browser?.close();
//         console.log("Browser closed");
//         isRecordingStopped = true;
        
//     } catch (error) {
//         console.error('Error stopping recording:', error);
//     }
// }

// module.exports = stopRecording;

// let gotItClicked = false;
// let isRecordingStopped=false
// async function checkBotPresence(page, browser, stream, fileStream,meetingId,userEmail) {
//     try {
//         const botName = 'riktam.ai NoteTaker'; // Adjust this to match the bot's name
//         if (isRecordingStopped) {
//             return true;
//         } else {
//             const frame = page.mainFrame();
//             if (!frame.isDetached()) {
//                 const { participants, leftMeetingText } = await frame.evaluate(() => {
//                     const leftMeetingElement = document.querySelector('h1[jsname="r4nke"].roSPhc');
//                     const leftMeetingText = leftMeetingElement ? leftMeetingElement.textContent : null;
//                     const participants = [];
//                     const participantElements = document.querySelectorAll('[data-self-name]');
//                     for (let participant of participantElements) {
//                         participants.push(participant.getAttribute('data-self-name'));
//                     }
//                     return { participants, leftMeetingText };
//                 });

//                 console.log('Participants:', participants);
//                 console.log('Meeting status:', leftMeetingText);

//                 if (leftMeetingText) {
//                     await stopRecording(browser, stream, fileStream,meetingId,userEmail);
//                     return;
//                 }

//                 if (participants.length >= 1) {
//                     if (!gotItClicked) {
//                         await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
//                         console.log('Clicked on "Got it" button');
//                         gotItClicked = true;
//                     }
//                 }

//                 if (participants.length === 1) {
//                     gotItClicked = false;
//                     await stopRecording(browser, stream, fileStream,meetingId,userEmail);
//                     return;
//                 }
//             }
//         }
//     } catch (error) {
//         if (error instanceof puppeteer.errors.TargetCloseError) {
//             console.error('Target closed. Terminating gracefully.');
//             await stopRecording(browser, stream, fileStream);
//         } else {
//             console.error('Error checking bot presence:', error);
//         }
//     }
// }


// let stop=false;
// app.post('/start-recording', async (req, res) => {
//     const { meetUrl,userEmail} = req.body;
//     console.log(meetUrl);
//     console.log(userEmail);
//     const parts = meetUrl.split('/');
//     const meetingId = parts[parts.length - 1];
//     console.log(meetingId);

//     try {
//         puppeteer.use(StealthPlugin());
//         const browser = await launch(puppeteer, {
//             defaultViewport: null,
//             headless: true,
//             devtools: false,
//             args: [
//                 "--autoplay-policy=no-user-gesture-required",
//             ],
//             executablePath: executablePath(),
//         });
//         const page = (await browser.pages())[0];
        
//         // Define the path for storing the recorded file
//         // const filePath = './report/video/meeting_recording.webm';
//         const filePath = `./report/video/meetingId_${meetingId}.webm`;
//         console.log(filePath)
//         const fileStream = fs.createWriteStream(filePath);
        
//         // Get the media stream
//         const stream = await getStream(page, { audio: true, video: true });
//         stream.pipe(fileStream);

//         const navigationPromise = page.waitForNavigation();
//         const context = browser.defaultBrowserContext();
//         await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);
        
//         await page.goto(meetUrl, { waitUntil: "networkidle0", timeout: 120000 });
//         await navigationPromise;

//         await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 50000 });
//         console.log('Name input found');
//         await page.type('input[aria-label="Your name"]', 'riktam.ai NoteTaker');

//         try {
//             const cameraButtonSelector = '[aria-label*="Turn off camera"]';
//             const microphoneButtonSelector = '[aria-label*="Turn off microphone"]';
            
//             await page.waitForSelector(cameraButtonSelector, { visible: true, timeout: 60000 });
//             console.log('Camera button found');
//             await page.click(cameraButtonSelector);
//             console.log('Camera turned off');
            
//             await page.waitForSelector(microphoneButtonSelector, { visible: true, timeout: 60000 });
//             console.log('Microphone button found');
//             await page.click(microphoneButtonSelector);
//             console.log('Microphone turned off');
//         } catch (err) {
//             console.error('Error turning off camera/microphone:', err);
//         }

//         const askToJoinButtonSelector = 'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]';
//         await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 50000 });
//         console.log('Ask to join button found');
//         await page.click(askToJoinButtonSelector);
//         console.log('Clicked on Ask to join button');

//         page.on('framenavigated', async (frame) => {
//             const url = frame.url();
//             console.log(url);
//             if (!url.includes('meet.google.com')) {
//                 console.log("Meeting Stopped");
//                 await stopRecording(browser, stream, fileStream,meetingId,userEmail);
//                 return
//             }
//         });

//         if(!stop){
//             setInterval(async () => {
//                 let answer=await checkBotPresence(page, browser, stream, fileStream,meetingId,userEmail);
//                 if (answer){
//                  stop=true
//                  return
//                 }
//              }, 10000);

//         }

//         res.status(200).json({ message: 'Recording started successfully.' });

//     } catch (error) {
//         console.error('Error starting recording:', error);
//         res.status(500).json({ error: 'An error occurred while starting recording.' });
//     }
// });


async function joinMeeting(meetUrl, userEmail) {
    console.log("Joining Meet");
    // const { meetUrl } = req.body;
    console.log(meetUrl);
    console.log(userEmail);
    const parts = meetUrl.split('/');
const meetingId = parts[parts.length - 1];
// const file = fs.createWriteStream("./report/test2.mp4");

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
        stream.pipe(fileStream);
        // stream.pipe(file);

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
                await stopRecording(browser, stream, fileStream,meetingId,userEmail);
                return
            }
        });
        
        setInterval(async () => {
           let answer=await checkBotPresence(page, browser, stream, fileStream,meetingId,userEmail);
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

// const openai = new OpenAIApi({
//     apikeys_v2:process.env.OPENAI_API_KEY
// });

// const audioFun = async()=>{
//     const transcription = await openai.audio.transcriptions.create({
//         // file:fs.createReadStream("./audio/audio.mp3"),
//         file:fs.createReadStream("./report/test4.mp4"),
//         // file:fs.createReadStream('https://riktam-recordings.s3.ap-south-1.amazonaws.com/recorded_video_MeetingId_bqu-ehua-ttt.webm'),
//         model:"whisper-1",
//         language: "en"
//     })
//     console.log(transcription);
// }



app.listen(Port,()=>{
    DBConnection();
    console.log(`Server is running on ${Port}`);
});

