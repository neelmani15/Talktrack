const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const DBConnection = require('./Connection/db.js');
const axios = require('axios');
// const puppeteer = require('puppeteer');
const User = require('./Schema/userSchema.js');
// const URL = require('url');

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

const file = fs.createWriteStream("./report/test2.mp4");

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

async function stopRecording(browser, stream, file) {
    try {
        // Stop recording and cleanup
        await stream.destroy();
        file.close();
        console.log("Recording stopped successfully.");
        await browser.close();
        // await wss.close();
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

let gotItClicked = false;
async function checkBotPresence(page, browser, stream, file){
    try {
        const botName = 'Nikhil.ai Bot'; // Adjust this to match the bot's name
        const frame = page.mainFrame();
        if (!frame.isDetached()) {
            const participants = await frame.evaluate(() => {
                const participants = [];
                const participantElements = document.querySelectorAll('[data-self-name]');
                for (let participant of participantElements) {
                    participants.push(participant.getAttribute('data-self-name'));
                }
                return participants;
            });

        console.log(participants);
        if (participants.length >= 1) {
            // Click on "Got it" button only if it hasn't been clicked already
            if (!gotItClicked) {
                await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
                console.log('Clicked on "Got it" button');
                gotItClicked = true; // Update flag to indicate that button has been clicked
            }
        }
        if (participants.length === 1) {
            gotItClicked=false;
            await stopRecording(browser, stream, file);
        }
    }
    } catch (error) {
        console.error('Error checking bot presence:', error);
    }
}

app.post('/start-recording', async (req, res) => {
    const { meetUrl } = req.body;
    console.log(meetUrl);
  
    try {
        puppeteer.use(StealthPlugin());
        const browser = await launch(puppeteer,{
            defaultViewport: null,
            headless: true,
            devtools: false,
            args: [
                // "--window-size=1920,1080",
                // "--window-position=1921,0",
                "--autoplay-policy=no-user-gesture-required",
              ],
            executablePath: executablePath(),
        });
    const page = (await browser.pages())[0];
    const stream = await getStream(page, { audio: true, video: true })
    stream.pipe(file)
    // const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(
        "https://meet.google.com/", ["microphone", "camera", "notifications"]
      );
      
      // Navigate to the Google Meet URL
      await page.goto(meetUrl,{
        waitUntil: "networkidle0",
        timeout: 120000
        });

        await navigationPromise;

        await page.waitForSelector('input[aria-label="Your name"]', {
            visible: true,
            timeout: 50000,
            hidden: false,
        });        
      
        await page.waitForSelector('[aria-label="Turn off camera (ctrl + e)"]', {
            visible: true,
            timeout: 50000,
            hidden: false,
        });
        await page.click('[aria-label="Turn off camera (ctrl + e)"]');
        await page.waitForSelector('[aria-label="Turn off microphone (ctrl + d)"]', {
            visible: true,
            timeout: 50000,
            hidden: false,
        });
        await page.click('[aria-label="Turn off microphone (ctrl + d)"]');


        await page.click(`input[aria-label="Your name"]`);


        //enter name
        await page.type(`input[aria-label="Your name"]`, 'Nikhil.ai Bot');

        //click on ask to join button
        await page.click(
            `button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`
        );
        page.on('framenavigated', async (frame) => {
            const url = frame.url();
            console.log(url);
            // Check if the URL indicates that the meeting has ended
            if (!url.includes('meet.google.com')) {
                console.log("Meeting Stopped");
                await stopRecording(browser, stream, file);
            }
        });
        setInterval(async () => {
            await checkBotPresence(page, browser, stream, file);
        }, 10000); // Check every minute
      // Provide feedback to the frontend
      res.status(200).json({ message: 'Recording started successfully.' });

    // setTimeout(async () => {
    //     // await recorder.stop();
    //     await stream.destroy();
    //     file.close();
    //     console.log("finished");
    //     await browser.close();
    //     (await wss).close();
    //   }, 120000);

    } catch (error) {
      console.error('Error starting recording:', error);
      res.status(500).json({ error: 'An error occurred while starting recording.' });
    }
  });

// app.post('/start-recording', async (req, res) => {
//     const { meetUrl } = req.body;
//     console.log(meetUrl);
  
//     try {
//         puppeteer.use(StealthPlugin());
//         const browser = await puppeteer.launch({headless: false,
//             defaultViewport: null,
//             devtools: false,
//             args : [
// '--disable-features=IsolateOrigins,site-per-process',
// '--disable-infobars',
// '--no-sandbox',
// '--disable-setuid-sandbox',
// ],
//             executablePath: executablePath(),
//           });
//         // For Chrome Browser
//         // const browser = await puppeteer.connect({
//         //     browserWSEndpoint: 'ws://localhost:9222/devtools/page/9B244F5A7DB4A2E60C404888E25424F0'
//         //   });
//     //   const page = await browser.newPage();
//     const page = (await browser.pages())[0];
//     const navigationPromise = page.waitForNavigation();
//     const context = browser.defaultBrowserContext();
//     await context.overridePermissions(
//         "https://meet.google.com/", ["microphone", "camera", "notifications"]
//       );
      
//       // Navigate to the Google Meet URL
//       await page.goto(meetUrl,{
//         waitUntil: "networkidle0",
//         timeout: 120000
//         });

//         await navigationPromise;

//         await page.waitForSelector('input[aria-label="Your name"]', {
//             visible: true,
//             timeout: 50000,
//             hidden: false,
//         });

//         // console.log(page);
        
      
//         await page.waitForSelector('[aria-label="Turn off camera (ctrl + e)"]', {
//             visible: true,
//             timeout: 50000,
//             hidden: false,
//         });
//         await page.click('[aria-label="Turn off camera (ctrl + e)"]');
//         await page.waitForSelector('[aria-label="Turn off microphone (ctrl + d)"]', {
//             visible: true,
//             timeout: 50000,
//             hidden: false,
//         });
//         await page.click('[aria-label="Turn off microphone (ctrl + d)"]');


//         await page.click(`input[aria-label="Your name"]`);


//         //enter name
//         await page.type(`input[aria-label="Your name"]`, 'Nikhil.ai Bot');

//         //click on ask to join button
//         await page.click(
//             `button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`
//         );

//         const recorder = new PuppeteerScreenRecorder.PuppeteerScreenRecorder(page);
//         await recorder.start('./report/video/simple.webm');

        

//         // const audioRecorder = new RecordRTC.MRecordRTC();
//         // audioRecorder.addStream(page.mediaDevices.getUserMedia({ audio: true }));

//         // // Start recording audio
//         // audioRecorder.startRecording();
      
//       // Start recording
//     //   const recording = await startRecording(page, {
//     //     output: 'recording.mp4', // Output file name
//     //     fps: 25, // Frames per second
//     //   });
  
//       // Provide feedback to the frontend
//       res.status(200).json({ message: 'Recording started successfully.' });

//     //   page.on('dialog', async dialog => {
//     //     if (dialog.message().includes('You left the meeting')) {
//     //         // Stop recording and save the video
//     //         await recorder.stop();
//     //         await browser.close();
//     //     }
//     // });

//     setTimeout(async () => {
//         await recorder.stop();
//         // await stream.destroy();
//         // file.close();
//         console.log("finished");
//         await browser.close();
//       }, 30000)
  
//       // Close the browser after recording is done
//     //   await browser.close();
//     } catch (error) {
//       console.error('Error starting recording:', error);
//       res.status(500).json({ error: 'An error occurred while starting recording.' });
//     }
//   });

app.post("/schedule-event",async(req,res)=>{
    console.log(req.body.formData);
    // const code = req.query;
    // console.log(code);
    // const {tokens}= await oauth2Client.getToken(code);
    // oauth2Client.setCredentials(tokens);
    // console.log(oauth2Client.credentials);
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${oauth2Client.credentials.access_token}`
        }
    });

    const attendeesEmails = [
        { 'email': 'neelmani242@gmail.com' },
        // { 'email': 'user2@example.com' }
        ];

    const user = await User.findOne({ googleId: data.id });
    // const event = {
    //     summary:"This is a test event",
    //     description:"Some event is very important",
    //     start:{
    //         dateTime: new Date().toISOString(),
    //     },
    //     end: {
    //         dateTime: new Date(new Date().getTime() + 3600000).toISOString(), 
    //     },
    // };
    // user.events.push(event);
    // await user.save();

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
            auth:oauth2Client,
            resource: event,
            conferenceDataVersion: 1
        });

        console.log(response);

        const summary = response.data.summary;
        const description = response.data.description;
        const location = response.data.location;
        const scheduleStartTime = response.data.start.dateTime;
        const scheduleEndTime = response.data.end.dateTime;
        const meetinglink = response.data.hangoutLink;
        const attendees = response.data.attendees;
        const alldata={
            summary:summary,
            description:description,
            start:scheduleStartTime,
            end:scheduleEndTime,
            url:meetinglink,
            // attendees:attendees
        }

        user.events.push(alldata);
        await user.save();
        
    
        // const { data: { summary, location, start, end, attendees }, config: { data: { conferenceData } } } = response;
    
        // Get the Google Meet conference URL in order to join the call
        // const { uri } = conferenceData.entryPoints[0];
        console.log(`📅 Calendar event created: ${summary} at ${location}, from ${scheduleStartTime} to ${scheduleEndTime}, attendees:\n${attendees.map(person => `🧍 ${person.email}`).join('\n')} \n 💻 Join conference call link: ${meetinglink}`);
        res.send({
            message:"Event Added"
        })
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response && error.response.data) {
            console.error("Google Calendar API error:", error.response.data);
            res.status(404).json({ message: 'Google Calendar API Error.' });
        }else{
            res.status(404).json({ message: 'Unable to add the Event' });
        }
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

// const file = fs.createWriteStream("./test.webm");

// puppeteer.use(StealthPlugin());
// (async () => {
//     try {
//       const browser = await puppeteer.launch({
//         headless: false, // Try running in headless mode if not already enabled
//         ignoreDefaultArgs: ['--mute-audio'], // Ignore default mute audio argument
//         executablePath: executablePath(), // Ensure executable path is correctly set
//       });
  
//       const page = await browser.newPage();
//       const context = browser.defaultBrowserContext();
  
//       await context.overridePermissions(
//         "https://meet.google.com/", ["microphone", "camera", "notifications"]
//       );
  
//       // going to Meet after signing in
//       await page.goto('https://meet.google.com/cmp-zzwo-adb' + '?hl=en', {
//         waitUntil: 'networkidle0',
//         timeout: 10000,
//       });
  
//       await page.waitForSelector('input[aria-label="Your name"]', {
//         visible: true,
//         timeout: 60000, // Increase the timeout to 60 seconds
//         hidden: false,
//       });
  
//       // turn off cam using Ctrl+E
//       await page.keyboard.down('ControlLeft');
//       await page.keyboard.press('KeyE');
//       await page.keyboard.up('ControlLeft');
//       await page.waitForTimeout(1000);
  
//       // turn off mic using Ctrl+D
//       await page.keyboard.down('ControlLeft');
//       await page.keyboard.press('KeyD');
//       await page.keyboard.up('ControlLeft');
//       await page.waitForTimeout(1000);
  
//       // click on input field to enter name
//       await page.click(`input[aria-label="Your name"]`);
  
//       // enter name
//       await page.type(`input[aria-label="Your name"]`, 'Bot');
  
//       // click on ask to join button
//       await page.click(
//         `button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]`
//       );
  
//       console.log("Browser launched successfully");
//     } catch (error) {
//       console.error("Error occurred during browser launch:", error);
//     }
//   })();

// app.get('/allevents',async(req,res)=>{
//     const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//         headers: {
//             Authorization: Bearer ${oauth2Client.credentials.access_token}
//         }
//     });

//     const user = await User.findOne({ googleId: data.id });
//     var alleventslist=[];
    
// })


// async function startRecordingGoogleMeet(meetUrl) {
//     const browser = await puppeteer.launch({
//         headless: false,
//         args: ['--disable-web-security'],
//     });
//     const page = await browser.newPage();
    
//     try {
//         // Navigate to the Google Meet URL
//         await page.goto(meetUrl);

//         // Wait for the "Join meeting" button to appear
//         await page.waitForSelector('div[jsname="Qx7uuf"]', { timeout: 30000 });
        
//         // Click the "Join meeting" button
//         await page.click('div[jsname="Qx7uuf"]');
        
//         // Wait for the meeting to join
//         await page.waitForTimeout(5000); // Adjust the timeout as needed
        
//         // Start recording the meeting (This part depends on your recording setup)
//         console.log('Meeting joined. Recording started.');
//     } catch (error) {
//         console.error('Error:', error);
//         // Handle error, for example, retry or log an error message
//     } finally {
//         // Close the browser when recording is complete
//         await browser.close();
//     }
// }
// startRecordingGoogleMeet('https://meet.google.com/fsw-xxat-dhd').

// puppeteer.use(StealthPlugin());
// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         args: ["--disable-notifications", "--mute-audio", "--enable-automation"],
//         ignoreDefaultArgs: true
//     });

//     // going to sign-in page
//     const page = await browser.newPage();
//     const navigationPromise = page.waitForNavigation();
//     await page.goto("https://accounts.google.com/");

//     const context = browser.defaultBrowserContext();
//     await context.overridePermissions(
//         "https://meet.google.com/", ["microphone", "camera", "notifications"]
//     );

//     await navigationPromise;

//     // typing out email
//     await page.waitForSelector('input[type="email"]');
//     await page.click('input[type="email"]');
//     await navigationPromise;
//     await page.keyboard.type(`neelmani264@gmail.com`, { delay: 300 });  // replace XXXXX with your original email, before the @gmail.com
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     await page.waitForSelector("#identifierNext");
//     await page.click("#identifierNext");

//     // typing out password
//     await new Promise(resolve => setTimeout(resolve, 3500));
//     await page.keyboard.type(`Neelmani@1598`, { delay: 200 });  // replace YYYYY with your original password
//     await new Promise(resolve => setTimeout(resolve, 800));
//     await page.keyboard.press('Enter');
//     await navigationPromise;

//     // going to Meet after signing in
//     await new Promise(resolve => setTimeout(resolve, 2500));
//     await page.goto("https://meet.google.com/");
//     await page.waitForSelector('input[type="text"]');
//     await page.click('input[type="text"]');
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await page.keyboard.type(`fsw-xxat-dhd`, { delay: 200 });  // replace aaa-bbbb-ccc with the required Google Meet Code
//     await new Promise(resolve => setTimeout(resolve, 800));
//     await page.keyboard.press('Enter');
//     await navigationPromise;

//     // turn off cam using Ctrl+E
//     await new Promise(resolve => setTimeout(resolve, 8000));
//     await page.keyboard.down('ControlLeft');
//     await page.keyboard.press('KeyE');
//     await page.keyboard.up('ControlLeft');
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     //turn off mic using Ctrl+D
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     await page.keyboard.down('ControlLeft');
//     await page.keyboard.press('KeyD');
//     await page.keyboard.up('ControlLeft');
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Join Now
//     var i;
//     for (i=1; i<=6; i++) {
//         await page.keyboard.press('Tab');
//         await new Promise(resolve => setTimeout(resolve, 800));
//     }
//     await page.keyboard.press('Enter');
//     await navigationPromise;

//     // open chat section and send a message to all
//     await new Promise(resolve => setTimeout(resolve, 3000));
//     for (i=1; i<=2; i++) {
//         await page.keyboard.press('Tab');
//         await new Promise(resolve => setTimeout(resolve, 600));
//     }
//     await page.keyboard.press('Enter');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await page.keyboard.type("Hello, good day everyone!", { delay: 100 });
//     await page.keyboard.press('Enter');

//     // close the chat box
//     await page.keyboard.press('Tab');
//     await page.keyboard.press('Enter');

//     // turn on captions
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     for (i=1; i<=6; i++) {
//         await page.keyboard.press('Tab');
//         await new Promise(resolve => setTimeout(resolve, 600));
//     }
//     await page.keyboard.press('Enter');   

// })();
app.listen(Port,()=>{
    DBConnection();
    console.log(`Server is running on ${Port}`);
});