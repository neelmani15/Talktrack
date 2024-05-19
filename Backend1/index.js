// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const { google, apikeys_v2 } = require('googleapis');
// const DBConnection = require('./Connection/db.js');
// const axios = require('axios');
// // const puppeteer = require('puppeteer');
// const User = require('./Schema/userSchema.js');
// const  OpenAIApi  = require('openai');
// const ffmpeg = require('fluent-ffmpeg');
// const multer = require('multer');
// // const URL = require('url');

// const puppeteerScreenRecorder = require('puppeteer-screen-recorder');

// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const { executablePath } = require('puppeteer');
// const fs = require('fs');
// // const AudioRecorder = require('node-audiorecorder');
// const PuppeteerScreenRecorder = require('puppeteer-screen-recorder');
// // const RecordRTC = require('recordrtc');

// const { launch, getStream,wss } = require("puppeteer-stream");

// // const file = fs.createWriteStream("./report/test4.webm");

// dotenv.config()

// const app = express();
// const Port = process.env.PORT || 5001;

// app.use(bodyParser.json());

// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
// }));

// app.get('/', (req, res) => {
//     res.send('Hello, Welcome to TalkTrack Backend!');
// });

// const openai = new OpenAIApi({
//     apikeys_v2:process.env.OPENAI_API_KEY
//   });

// const audioFun = async()=>{
//     const transcription = await openai.audio.transcriptions.create({
//         // file:fs.createReadStream("./audio/audio.mp3"),
//         file:fs.createReadStream("./report/test5.webm"),
//         // file:fs.createReadStream("./report/test6.webm"),
//         model:"whisper-1",
//         language: "en"
//     })
//     console.log(transcription);
// }

// // audioFun()

// const calendar = google.calendar({
//     version:"v3",
//     auth:process.env.API_KEY
// })

// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_CLIENT_URL
// );

// const scopes = [
//     "email",
//     "profile",
//     'https://www.googleapis.com/auth/calendar'
//   ];

// app.get('/auth/google',(req,res)=>{
//     const url = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: scopes
//     });
//     // const myUrl = new URL(url); 
//     // res.redirect(myUrl);
//     res.redirect(url);
// });

// app.get('/auth/google/callback',async (req,res)=>{
//     // console.log(req.query);
//     try{

//         const code = req.query.code;
//         const {tokens}= await oauth2Client.getToken(code);
//         oauth2Client.setCredentials(tokens);
//         // console.log(oauth2Client);
    
//         const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//             headers: {
//                 Authorization: `Bearer ${tokens.access_token}`
//             }
//         });
    
//         await User.findOneAndUpdate({ googleId: data.id }, {
//             googleId: data.id,
//             email: data.email,
//             displayName: data.name,
//             googleAccessToken:tokens.access_token
//         }, { upsert: true });
//         console.log(data);
        
//         // res.status(200).json({ message: 'User Login successfully.' });
//         res.redirect('http://localhost:3000/login/success');
//         // const user_info = await axios.get(https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token})
//         // console.log(user_info);
//         // res.send({
//         //     message:"You have successfully logged in"
//         // })
//     }catch(err){
//         console.log("Error in Login",err);
//         res.status(404).json({ message: 'Unable to Register User'});
//     }
// });

// async function stopRecording(browser, stream, file) {
//     try {
//         // Stop recording and cleanup
//         await stream.destroy();
//         file.close();
//         console.log("Recording stopped successfully.");
//         await browser.close();
//         // await wss.close();
//     } catch (error) {
//         console.error('Error stopping recording:', error);
//     }
// }

// let gotItClicked = false;
// async function checkBotPresence(page, browser, stream, file){
//     try {
//         const botName = 'Nikhil.ai Bot'; // Adjust this to match the bot's name
//         const frame = page.mainFrame();
//         // if (!frame.isDetached()) {
//         //     const participants = await frame.evaluate(() => {
//         //         const participants = [];
//         //         const participantElements = document.querySelectorAll('[data-self-name]');
//         //         for (let participant of participantElements) {
//         //             participants.push(participant.getAttribute('data-self-name'));
//         //         }
//         //         return participants;
//         //     });
//         if (!frame.isDetached()) {
//             const participants = await frame.evaluate(() => {
//                 const participantElements = document.querySelectorAll('div.dwSJ2e');
//                 const participantNames = [];
//                 participantElements.forEach(participant => {
//                     participantNames.push(participant.innerText);
//                 });
//                 return participantNames;
//             });

//         console.log(participants);
//         if (participants.length >= 1) {
//             // Click on "Got it" button only if it hasn't been clicked already
//             if (!gotItClicked) {
//                 await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
//                 console.log('Clicked on "Got it" button');
//                 gotItClicked = true; // Update flag to indicate that button has been clicked
//             }
//         }
//         if (participants.length === 1) {
//             gotItClicked=false;
//             await stopRecording(browser, stream, file);
//         }
//     }
//     } catch (error) {
//         console.error('Error checking bot presence:', error);
//     }
// }

// app.post('/start-recording', async (req, res) => {
//     const { meetUrl } = req.body;
//     console.log(meetUrl);
//     const file = fs.createWriteStream("./report/test7.webm");
  
//     try {
//         puppeteer.use(StealthPlugin());
//         const browser = await launch(puppeteer,{
//             defaultViewport: null,
//             headless: true,
//             devtools: false,
//             args: [
//                 // "--window-size=1920,1080",
//                 // "--window-position=1921,0",
//                 "--autoplay-policy=no-user-gesture-required",
//               ],
//             executablePath: executablePath(),
//         });
//     const page = (await browser.pages())[0];
//     const stream = await getStream(page, { audio: true, video: true });
//     // console.log(stream);
//     // const page = await browser.newPage();
//     const navigationPromise = page.waitForNavigation();
//     const context = browser.defaultBrowserContext();
//     await context.overridePermissions(
//         "https://meet.google.com/", ["microphone", "camera", "notifications"]
//     );
    
//     // Navigate to the Google Meet URL
//     await page.goto(meetUrl,{
//         waitUntil: "networkidle0",
//         timeout: 120000
//     });
    
//     await navigationPromise;
    
//     await page.waitForSelector('input[aria-label="Your name"]', {
//         visible: true,
//         timeout: 50000,
//         hidden: false,
//     });        
    
//     await page.waitForSelector('[aria-label="Turn off camera (ctrl + e)"]', {
//         visible: true,
//         timeout: 50000,
//         hidden: false,
//     });
//     await page.click('[aria-label="Turn off camera (ctrl + e)"]');
//     await page.waitForSelector('[aria-label="Turn off microphone (ctrl + d)"]', {
//         visible: true,
//         timeout: 50000,
//         hidden: false,
//     });
//     await page.click('[aria-label="Turn off microphone (ctrl + d)"]');
    
    
//     await page.click(`input[aria-label="Your name"]`);
    
    
//     //enter name
//     await page.type(`input[aria-label="Your name"]`, 'riktam.ai Notetaker');
    
//     //click on ask to join button
//     await page.click(
//         `button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`
//     );
//     stream.pipe(file)
//     // const stream = await getStream(page, { audio: true, video: true });
//     // console.log(stream);
//         // stream.pipe(file)
//         page.on('framenavigated', async (frame) => {
//             const url = frame.url();
//             console.log(url);
//             // Check if the URL indicates that the meeting has ended
//             if (!url.includes('meet.google.com')) {
//                 console.log("Meeting Stopped");
//                 await stopRecording(browser, stream, file);
//             }
//         });
//         setInterval(async () => {
//             await checkBotPresence(page, browser, stream, file);
//         }, 10000); // Check every 10 sec
//       // Provide feedback to the frontend
//       res.status(200).json({ message: 'Recording started successfully.' });

//     } catch (error) {
//       console.error('Error starting recording:', error);
//       res.status(500).json({ error: 'An error occurred while starting recording.' });
//     }
//   });


// // For Mac

// // app.post('/start-recording', async (req, res) => {
// //     const { meetUrl } = req.body;
// //     console.log(meetUrl);
  
// //     let browser;
// //     let page;
// //     try {
// //         browser = await puppeteer.launch({
// //             headless: false,
// //             defaultViewport: null,
// //             devtools: false,
// //             args: [
// //                 '--disable-features=IsolateOrigins,site-per-process',
// //                 '--disable-infobars',
// //                 '--no-sandbox',
// //                 '--disable-setuid-sandbox',
// //             ],
// //             executablePath: executablePath(),
// //         });

// //         page = (await browser.pages())[0];
// //         const navigationPromise = page.waitForNavigation();
// //         const context = browser.defaultBrowserContext();
// //         await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);

// //         await page.goto(meetUrl, { waitUntil: "networkidle0", timeout: 120000 });
// //         await navigationPromise;

// //         await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 50000 });
// //         console.log('Name input found');
// //         await page.type('input[aria-label="Your name"]', 'riktam.ai NoteTaker');

// //         try {
// //             const cameraButtonSelector = '[aria-label*="Turn off camera"]';
// //             const microphoneButtonSelector = '[aria-label*="Turn off microphone"]';
            
// //             await page.waitForSelector(cameraButtonSelector, { visible: true, timeout: 60000 });
// //             console.log('Camera button found');
// //             await page.click(cameraButtonSelector);
// //             console.log('Camera turned off');
            
// //             await page.waitForSelector(microphoneButtonSelector, { visible: true, timeout: 60000 });
// //             console.log('Microphone button found');
// //             await page.click(microphoneButtonSelector);
// //             console.log('Microphone turned off');
// //         } catch (err) {
// //             console.error('Error turning off camera/microphone:', err);
// //         }

// //         const askToJoinButtonSelector = 'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]';
// //         await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 50000 });
// //         console.log('Ask to join button found');
// //         await page.click(askToJoinButtonSelector);
// //         console.log('Clicked on Ask to join button');

// //         await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 50000 });
// //         console.log('Join now button found');
// //         await page.click(askToJoinButtonSelector);
// //         console.log('Clicked on Join now button');

// //         const recorder = new PuppeteerScreenRecorder.PuppeteerScreenRecorder(page);
// //         await recorder.start('./report/video/simple.webm');
// //         console.log('Recording started');

// //         res.status(200).json({ message: 'Recording started successfully.' });

// //         setTimeout(async () => {
// //             await recorder.stop();
// //             console.log("Recording finished");
// //             await browser.close();
// //         }, 50000);

// //     } catch (error) {
// //         console.error('Error starting recording:', error);

// //         if (page) {
// //             await page.screenshot({ path: 'error_screenshot.png' });
// //             console.log('Screenshot taken');
// //             const htmlContent = await page.content();
// //             fs.writeFileSync('error_page.html', htmlContent);
// //             console.log('HTML content saved');
// //         }

// //         res.status(500).json({ error: 'An error occurred while starting recording.' });
// //         if (browser) {
// //             await browser.close();
// //         }
// //     }
// // });


// app.post("/schedule-event",async(req,res)=>{
//     console.log(req.body.formData);
//     // const code = req.query;
//     // console.log(code);
//     // const {tokens}= await oauth2Client.getToken(code);
//     // oauth2Client.setCredentials(tokens);
//     // console.log(oauth2Client.credentials);
//     const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//         headers: {
//             Authorization: `Bearer ${oauth2Client.credentials.access_token}`
//         }
//     });

//     const attendeesEmails = [
//         { 'email': 'neelmani242@gmail.com' },
//         // { 'email': 'user2@example.com' }
//         ];

//     const user = await User.findOne({ googleId: data.id });
//     // const event = {
//     //     summary:"This is a test event",
//     //     description:"Some event is very important",
//     //     start:{
//     //         dateTime: new Date().toISOString(),
//     //     },
//     //     end: {
//     //         dateTime: new Date(new Date().getTime() + 3600000).toISOString(), 
//     //     },
//     // };
//     // user.events.push(event);
//     // await user.save();

//     const event = {
//         summary: req.body.formData.summary,
//         location: 'Virtual / Google Meet',
//         description: req.body.formData.description,
//         start: {
//           dateTime: req.body.formData.startTime,
//         },
//         end: {
//           dateTime: req.body.formData.endTime,
//         },
//         attendees: attendeesEmails,
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'email', 'minutes': 24 * 60 },
//             { method: 'popup', 'minutes': 10 },
//           ],
//         },
//         conferenceData: {
//           createRequest: {
//             conferenceSolutionKey: {
//               type: 'hangoutsMeet'
//             },
//             requestId: 'coding-calendar-demo'
//           }
//         },
//       };
      

//       try {
//         const response = await calendar.events.insert({
//             calendarId: 'primary',
//             auth:oauth2Client,
//             resource: event,
//             conferenceDataVersion: 1
//         });

//         console.log(response);

//         const summary = response.data.summary;
//         const description = response.data.description;
//         const location = response.data.location;
//         const scheduleStartTime = response.data.start.dateTime;
//         const scheduleEndTime = response.data.end.dateTime;
//         const meetinglink = response.data.hangoutLink;
//         const attendees = response.data.attendees;
//         const alldata={
//             summary:summary,
//             description:description,
//             start:scheduleStartTime,
//             end:scheduleEndTime,
//             url:meetinglink,
//             // attendees:attendees
//         }

//         user.events.push(alldata);
//         await user.save();
        
    
//         // const { data: { summary, location, start, end, attendees }, config: { data: { conferenceData } } } = response;
//         // const { uri } = conferenceData.entryPoints[0];
//         console.log(`📅 Calendar event created: ${summary} at ${location}, from ${scheduleStartTime} to ${scheduleEndTime}, attendees:\n${attendees.map(person => `🧍 ${person.email}`).join('\n')} \n 💻 Join conference call link: ${meetinglink}`);
//         res.send({
//             message:"Event Added"
//         })
//     } catch (error) {
//         console.error("Error:", error.message);
//         if (error.response && error.response.data) {
//             console.error("Google Calendar API error:", error.response.data);
//             res.status(404).json({ message: 'Google Calendar API Error.' });
//         }else{
//             res.status(404).json({ message: 'Unable to add the Event' });
//         }
//     }
// });

// app.get('/allevents', async (req, res) => {
//     try {
//         const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//             headers: {
//                 Authorization: `Bearer ${oauth2Client.credentials.access_token}`
//             }
//         });

//         const user = await User.findOne({ googleId: data.id });

//         // Check if user exists and has events
//         if (user && user.events.length > 0) {
//             // Initialize the list to store all events
//             var alleventslist = [];

//             // Iterate through each event and add it to the list
//             user.events.forEach(event => {
//                 alleventslist.push(event);
//             });

//             // Send the list of all events to the frontend
//             // res.json(alleventslist);
//             res.status(200).json({ message: 'All Events are listed',alleventslist });
//         } else {
//             res.status(404).json({ message: 'User not found or no events found for the user.' });
//         }
//     } catch (error) {
//         console.error('Error fetching events:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.listen(Port,()=>{
//     DBConnection();
//     console.log(`Server is running on ${Port}`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { google, apikeys_v2 } = require('googleapis');
const DBConnection = require('./Connection/db.js');
const axios = require('axios');
const User = require('./Schema/userSchema.js');
const OpenAIApi = require('openai');
const multer = require('multer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const fs = require('fs');
const { launch, getStream, wss } = require("puppeteer-stream");

dotenv.config();

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

const openai = new OpenAIApi({
    apikeys_v2: process.env.OPENAI_API_KEY
});

const calendar = google.calendar({
    version: "v3",
    auth: process.env.API_KEY
});

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

app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        await User.findOneAndUpdate({ googleId: data.id }, {
            googleId: data.id,
            email: data.email,
            displayName: data.name,
            googleAccessToken: tokens.access_token
        }, { upsert: true });
        
        res.redirect('http://localhost:3000/login/success');
    } catch (err) {
        console.log("Error in Login", err);
        res.status(404).json({ message: 'Unable to Register User' });
    }
});

async function stopRecording(browser, stream, file) {
    try {
        await stream.destroy();
        file.close();
        console.log("Recording stopped successfully.");
        await browser.close();
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

let gotItClicked = false;
async function checkBotPresence(page, browser, stream, file) {
    try {
        const frame = page.mainFrame();
        if (!frame.isDetached()) {
            const participants = await frame.evaluate(() => {
                const participantElements = document.querySelectorAll('div.dwSJ2e');
                const participantNames = [];
                participantElements.forEach(participant => {
                    participantNames.push(participant.innerText);
                });
                return participantNames;
            });

            console.log(participants);
            if (participants.length >= 1) {
                if (!gotItClicked) {
                    await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
                    console.log('Clicked on "Got it" button');
                    gotItClicked = true;
                }
            }
            if (participants.length === 1) {
                gotItClicked = false;
                await stopRecording(browser, stream, file);
            }
        }
    } catch (error) {
        console.error('Error checking bot presence:', error);
    }
}

async function startBotRecording(meetUrl) {
    const file = fs.createWriteStream("./report/test7.webm");

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
        const stream = await getStream(page, { audio: true, video: true });

        const navigationPromise = page.waitForNavigation();
        const context = browser.defaultBrowserContext();
        await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);

        await page.goto(meetUrl, {
            waitUntil: "networkidle0",
            timeout: 120000
        });

        await navigationPromise;

        await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 50000 });
        await page.waitForSelector('[aria-label="Turn off camera (ctrl + e)"]', { visible: true, timeout: 50000 });
        await page.click('[aria-label="Turn off camera (ctrl + e)"]');
        await page.waitForSelector('[aria-label="Turn off microphone (ctrl + d)"]', { visible: true, timeout: 50000 });
        await page.click('[aria-label="Turn off microphone (ctrl + d)"]');
        await page.click(`input[aria-label="Your name"]`);
        await page.type(`input[aria-label="Your name"]`, 'riktam.ai Notetaker');
        await page.click(`button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`);

        stream.pipe(file);

        page.on('framenavigated', async (frame) => {
            const url = frame.url();
            if (!url.includes('meet.google.com')) {
                await stopRecording(browser, stream, file);
            }
        });

        setInterval(async () => {
            await checkBotPresence(page, browser, stream, file);
        }, 10000);
        
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

app.post("/schedule-event", async (req, res) => {
    const { formData } = req.body;
    const attendeesEmails = [
        { 'email': 'neelmani242@gmail.com' },
    ];

    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${oauth2Client.credentials.access_token}`
        }
    });

    const user = await User.findOne({ googleId: data.id });

    const event = {
        summary: formData.summary,
        location: 'Virtual / Google Meet',
        description: formData.description,
        start: {
            dateTime: formData.startTime,
        },
        end: {
            dateTime: formData.endTime,
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

        const eventData = response.data;
        const startTime = new Date(eventData.start.dateTime);
        const endTime = new Date(eventData.end.dateTime);
        const meetingLink = eventData.hangoutLink;
        const bufferTime = new Date(startTime.getTime() - 5 * 60000);

        const alldata = {
            summary: eventData.summary,
            description: eventData.description,
            start: eventData.start.dateTime,
            end: eventData.end.dateTime,
            url: meetingLink,
        };

        user.events.push(alldata);
        await user.save();

        console.log(bufferTime);

        setTimeout(() => {
            startBotRecording(meetingLink);
        }, bufferTime.getTime() - new Date().getTime());

        setTimeout(() => {
            stopRecording();
        }, endTime.getTime() - new Date().getTime());

        res.send(response);
    } catch (error) {
        console.log('Calendar event creation error', error);
        res.status(500).json({ message: 'Error scheduling the event' });
    }
});

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

app.listen(Port, () => {
    DBConnection();
    console.log(`TalkTrack Server is Running at ${Port}`);
});
