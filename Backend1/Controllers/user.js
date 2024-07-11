const { google } = require('googleapis');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const axios = require('axios');
const User = require('../Models/userSchema.js');
const Meeting = require('../Models/MeetRecord.js');
const OpenAI = require("openai");
const fs = require('fs');
const { parseISO, subMinutes, addMinutes, isAfter, isBefore } = require('date-fns');
const { launch, getStream, wss } = require("puppeteer-stream");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const uploadToS3 = require('../Connection/uploadToS3');
const downloadvideoFromS3 = require('../Connection/downloadfroms3');
const uploadAudioToS3 = require('../Connection/uploadaudioToS3');
const { generateMultiSpeakerTranscription } = require('../Connection/assemblyai');
const { handleAudioStream, HandleVideoStream } = require('../Connection/avaccessurls');
const { startTranscriptionJob, getTranscriptionResult, checkTranscriptionJobExists } = require('../Connection/awstranscribe.js');
const getAudio = require('..//Connection/getaudio');
const GetTranscript = require('../Connection/getTranscript.js');
const checkVideoExists = require('..//Connection/videocheck');
const { trusted } = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const calendar = google.calendar({
    version: "v3",
    auth: process.env.API_KEY
})


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_URL
);

require('dotenv').config();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { fromEnv } = require('@aws-sdk/credential-provider-env');


//i added the changes related to 
async function HandleScheduleEvent(req, res) {
    console.log("schedule  executed");


    const { dataToSubmit } = req.body; // Destructure userEmail and formData from the request body
    console.log(dataToSubmit)

    try {
        const user = await User.findOne({ email: dataToSubmit.userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        oauth2Client.setCredentials({
            access_token: user.googleAccessToken,
            // If you have a refresh token, set it here as well
            // refresh_token: user.googleRefreshToken,
        });

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        });

        let attendeesEmails = [
            { email: 'riktamaibot@gmail.com' }
        ];

        // Add additional attendees if they exist
        if (dataToSubmit.attendees && dataToSubmit.attendees.length > 0) {
            const additionalAttendees = dataToSubmit.attendees.map(email => ({ email }));
            attendeesEmails = attendeesEmails.concat(additionalAttendees);
        }

        console.log(attendeesEmails);

        const event = {
            summary: dataToSubmit.summary,
            location: 'Virtual / Google Meet',
            description: dataToSubmit.description,
            start: {
                dateTime: dataToSubmit.startTime,
            },
            end: {
                dateTime: dataToSubmit.endTime,
            },
            attendees: attendeesEmails,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
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

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1
        });

        //   console.log(response);

        const summary = response.data.summary;
        const description = response.data.description;
        const location = response.data.location;
        const scheduleStartTime = response.data.start.dateTime;
        const scheduleEndTime = response.data.end.dateTime;
        const meetinglink = response.data.hangoutLink;
        const attendees = response.data.attendees;
        const userEmail = dataToSubmit.userEmail;
        console.log(meetinglink)
        const parts = meetinglink.split('/');
        console.log(parts)
        const meetingId = parts[parts.length - 1];
        console.log(meetingId)
        const alldata = {
            summary: summary,
            description: description,
            start: scheduleStartTime,
            end: scheduleEndTime,
            url: meetinglink,
            MeetingId: meetingId,
            // attendees: attendees
        };
        console.log(alldata)
        user.scheduleEvents.push(alldata);
        await user.save();

        const startTime = parseISO(scheduleStartTime);
        const endTime = parseISO(scheduleEndTime);
        const botJoinTime = subMinutes(startTime, 5);
        const interval = 1 * 60 * 1000; // 1 minutes in milliseconds

        let joined = false;

        const checkAndJoinMeeting = async () => {
            if (joined) {
                clearInterval(intervalId);
                joined = false;
                return;
            }
            const now = new Date();
            if (isAfter(now, botJoinTime) && isBefore(now, endTime)) {
                joined = await HandlejoinMeeting(meetinglink, userEmail);
                if (joined) {
                    clearInterval(intervalId);
                    joined = false;
                }
            } else if (isAfter(now, endTime)) {
                clearInterval(intervalId);
                joined = false;
            }
        };

        const intervalId = setInterval(checkAndJoinMeeting, interval);

        console.log(`📅 Calendar event created: ${summary} at ${location}, from ${scheduleStartTime} to ${scheduleEndTime}, attendees:\n${attendees.map(person => `🧍 ${person.email}`).join('\n')} \n 💻 Join conference call link: ${meetinglink}`);

        res.send({
            message: "Event Added"
        });
    } catch (error) {
        console.error("Error:", error.message);
        if (error.response && error.response.data) {
            console.error("Google Calendar API error:", error.response.data);
            res.status(500).json({ message: 'Google Calendar API Error.' });
        } else {
            res.status(500).json({ message: 'Unable to add the Event' });
        }
    }
}

let stop = false;

let meetingstartTime;
async function HandlejoinMeeting(meetUrl, userEmail) {
    console.log("Joining Meet");

    let botPresence1 = false;
    const parts = meetUrl.split('/');
    const meetingId = parts[parts.length - 1];

    console.log(meetingId);

    try {
        puppeteer.use(StealthPlugin());
        const browser = await launch(puppeteer, {
            // defaultViewport: null,
            // headless: true,
            // devtools: false,
            // args: [
            //     "--autoplay-policy=no-user-gesture-required",
            // ],
            // executablePath: executablePath(),
            defaultViewport: { width: 1320, height: 760 },
            headless: true,
            devtools: false,
            args: [
                "--autoplay-policy=no-user-gesture-required", '--no-sandbox', '--disable-setuid-sandbox',    '--disable-audio',
      '--disable-microphone',
      '--disable-camera',
                    '--disable-cache',
                '--disk-cache-size=0'
            ],

            executablePath: process.env.Chrome_Executable_Path
        });
        const page = (await browser.pages())[0];

        const filePath =` ./report/video/meetingId_${meetingId}.webm`;
        console.log(filePath);
        const fileStream = fs.createWriteStream(filePath);

        const stream = await getStream(page, { audio: true, video: true });
        stream.pipe(fileStream);

        const navigationPromise = page.waitForNavigation();
        const context = browser.defaultBrowserContext();
        await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);

        await page.goto(meetUrl, { waitUntil: "networkidle0", timeout: 120000 });
        await navigationPromise;

        await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 50000 });
        console.log('Name input found');
        await page.type('input[aria-label="Your name"]', 'riktam.ai NoteTaker');

        // try {
        //     const cameraButtonSelector = '[aria-label*="Turn off camera"]';
        //     const microphoneButtonSelector = '[aria-label*="Turn off microphone"]';

        //     await page.waitForSelector(cameraButtonSelector, { visible: true, timeout: 180000 });
        //     console.log('Camera button found');
        //     await page.click(cameraButtonSelector);
        //     console.log('Camera turned off');

        //     await page.waitForSelector(microphoneButtonSelector, { visible: true, timeout: 180000 });
        //     console.log('Microphone button found');
        //     await page.click(microphoneButtonSelector);
        //     console.log('Microphone turned off');

        // } catch (err) {
        //     console.error('Error turning off camera/microphone:', err);
        // }

        const askToJoinButtonSelector = 'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]';
        await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 180000 });
        console.log('Ask to join button found');
        await page.click(askToJoinButtonSelector);
        console.log('Clicked on Ask to join button');

        meetingstartTime = Date.now();
        console.log("MeetingStartTime", meetingstartTime);

        const participantCheckInterval = setInterval(async () => {
            const botPresence = await HandleCheckBotPresence(page,participantCheckInterval);
            botPresence1 = botPresence.status;
            const orderedSpeaker = botPresence.orderedParticipants;
            console.log("Getting", botPresence1);
            if (botPresence1 || isRecordingStopped) {
                clearInterval(participantCheckInterval);
                await HandleStopRecording(browser, stream, fileStream, meetingId, userEmail, orderedSpeaker, meetingstartTime,participantCheckInterval);
                isRecordingStopped=false;
                isParticipantsButtonClicked=false;
                checkInterval=null;
            }
        }, 10000);
        return true;

    } catch (error) {
        console.error('Error starting recording:', error);
        return false;
    }
}


async function HandleLiveMeeting(req, res) {
    let botPresence1=false;
    console.log("Joining Meet");
    const { meetUrl, userEmail } = req.body;
    console.log(meetUrl);
    console.log(userEmail);
    const parts = meetUrl.split('/');
    let meetingId = parts[parts.length - 1];

    console.log(meetingId);

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the meetingId already exists in user's events and generate a unique meetingId if necessary
        let originalMeetingId = meetingId;
        let suffix = 1;
        while (user.liveEvents.some(event => event.MeetingId === meetingId)) {
            meetingId = `${originalMeetingId}${suffix}`;
            suffix++;
        }

        oauth2Client.setCredentials({
            access_token: user.googleAccessToken,
        });
        const currentDateTime = new Date();
        const oneHourLater = new Date(currentDateTime.getTime() + (60 * 60 * 1000));
        const alldata = {
            summary: `Live ${meetingId}`,
            description: "Some Topic",
            start: currentDateTime,
            end: oneHourLater,
            url: meetUrl,
            MeetingId: meetingId
        };
        console.log(alldata);
        user.liveEvents.push(alldata);
        await user.save();
        puppeteer.use(StealthPlugin());
        const browser = await launch(puppeteer, {
            // defaultViewport: null,
            // headless: true,
            // devtools: false,
            // args: [
            //     "--autoplay-policy=no-user-gesture-required",
            // ],
            // executablePath: executablePath(),
            defaultViewport: { width: 1320, height: 760 },
            headless: true,
            devtools: false,
            args: [
                "--autoplay-policy=no-user-gesture-required", '--no-sandbox', '--disable-setuid-sandbox',    '--disable-audio',
      '--disable-microphone',
      '--disable-camera',
                    '--disable-cache',
                '--disk-cache-size=0'
            ],

            executablePath: process.env.Chrome_Executable_Path
        });
        const page = (await browser.pages())[0];

        const filePath = `./report/video/meetingId_${meetingId}.webm`;
        console.log(filePath);
        const fileStream = fs.createWriteStream(filePath);

        // Get the media stream
        const stream = await getStream(page, { audio: true, video: true });
        stream.pipe(fileStream);

        const navigationPromise = page.waitForNavigation();
        const context = browser.defaultBrowserContext();
        await context.overridePermissions("https://meet.google.com/", ["microphone", "camera", "notifications"]);

        await page.goto(meetUrl, { waitUntil: "networkidle0", timeout: 180000 });
        await navigationPromise;

        await page.waitForSelector('input[aria-label="Your name"]', { visible: true, timeout: 180000 });
        console.log('Name input found');
        await page.type('input[aria-label="Your name"]', 'riktam.ai NoteTaker');

        // try {
        //     const cameraButtonSelector = '[aria-label*="Turn off camera"]';
        //     const microphoneButtonSelector = '[aria-label*="Turn off microphone"]';

        //     await page.waitForSelector(cameraButtonSelector, { visible: true, timeout: 180000 });
        //     console.log('Camera button found');
        //     await page.click(cameraButtonSelector);
        //     console.log('Camera turned off');

        //     await page.waitForSelector(microphoneButtonSelector, { visible: true, timeout: 180000 });
        //     console.log('Microphone button found');
        //     await page.click(microphoneButtonSelector);
        //     console.log('Microphone turned off');

        // } catch (err) {
        //     console.error('Error turning off camera/microphone:', err);
        // }

        const askToJoinButtonSelector = 'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 jEvJdc QJgqC"]';
        await page.waitForSelector(askToJoinButtonSelector, { visible: true, timeout: 180000 });
        console.log('Ask to join button found');
        await page.click(askToJoinButtonSelector);
        console.log('Clicked on Ask to join button');

        meetingstartTime = Date.now();

        console.log("MeetingStartTime", meetingstartTime);

        const participantCheckInterval = setInterval(async () => {
            const botPresence = await HandleCheckBotPresence(page,participantCheckInterval);
            console.log("Bot",botPresence);
            botPresence1 = botPresence.status;
            const orderedSpeaker = botPresence.orderedParticipants;
            console.log("Getting", botPresence1);
            if (botPresence1 || isRecordingStopped) {
                clearInterval(participantCheckInterval);
                await HandleStopRecording(browser, stream, fileStream, meetingId, userEmail, orderedSpeaker, meetingstartTime,participantCheckInterval);
                isRecordingStopped=false;
                isParticipantsButtonClicked=false;
                checkInterval=null;
            }
            
        }, 10000);
        // return true;
       
        return res.status(200).json({ status: true, message: 'Recording started successfully.' });


    } catch (error) {
        // console.error('Error starting recording:', error);
        return res.status(200).json({ status: false, message: 'Recording not successfully.' });
        // return false;
        // res.status(500).json({ error: 'An error occurred while starting recording.' });
    }
}


async function HandleStopRecording(browser, stream, fileStream, meetingId, userEmail, orderedSpeaker, meetingstartTime,participantCheckInterval) {
    try {
        stop = true
        stream.unpipe(fileStream);
        fileStream.end();
        console.log("Speaker on HandleStop", orderedSpeaker);
        console.log("Recording stopped successfully.");
        console.log("Time of Meeting Start", meetingstartTime);
        console.log("Meeting Id to Stoprecordeing",meetingId);
        clearInterval(participantCheckInterval)
        allParticipants.clear();
        // const distinctParticipants = getDistinctParticipants(orderedSpeaker);
        // console.log("Distinct Participants:", distinctParticipants);

        // // Get transitions
        // const transitions = getTransitions(orderedSpeaker, meetingstartTime);
        // console.log("Transitions:", transitions)

        promisefun(meetingId,fileStream,userEmail, orderedSpeaker, meetingstartTime).then(() => {
            console.log("promisefun executed asynchronously.");
        }).catch(err => {
            console.error("Error executing promisefun:", err);
        });

       
        // const meetingRecord = new Meeting({
        //     userEmail: userEmail,
        //     meetingId: meetingId,
        //     videoS3url: s3Url,
        //     assemblytranscritps: '',
        //     orderedSpeaker: distinctParticipants,
        //     orderSpeakerTimeBasis: transitions,
        //     meetingStartTime: meetingstartTime
        // });

        // await meetingRecord.save();

        // console.log("Meeting record saved successfully.");
        // await browser?.close();
        // console.log("browser closed")
        try {
            if (browser && browser.isConnected()) {
                await browser?.close();
                console.log("browser closed");
            }else{
                console.log('browser not closing')
            }
        } catch (error) {

            console.error('Error closing browser:', error);

        }
   
        isRecordingStopped = true
        orderedParticipants=[]
        seenParticipants = new Map();
        return orderedSpeaker

    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

async function promisefun(meetingId,fileStream,userEmail, orderedSpeaker, meetingstartTime){
    const distinctParticipants = getDistinctParticipants(orderedSpeaker);
        console.log("Distinct Participants:", distinctParticipants);

        // Get transitions
        const transitions = getTransitions(orderedSpeaker, meetingstartTime);
        console.log("Transitions:", transitions)

    const s3Url = await uploadToS3(fileStream.path, process.env.S3_BUCKET_NAME, meetingId);
    console.log(s3Url)

    const meetingRecord = new Meeting({
        userEmail: userEmail,
        meetingId: meetingId,
        videoS3url: s3Url,
        assemblytranscritps: '',
        orderedSpeaker: distinctParticipants,
        orderSpeakerTimeBasis: transitions,
        meetingStartTime: meetingstartTime
    });

    await meetingRecord.save();
    const videoPath = `./report/video/meetingId_${meetingId}.webm`;
    const audioOutputDir = path.dirname(videoPath);

    // Extract audio from the video file

    const audioPath = await getAudio(videoPath, audioOutputDir);
    console.log(audioPath);
    removeSpecificFile('./report/video', `meetingId_${meetingId}.webm`);

}
async function extractMicDetails(page, initialSpeak, seenParticipants) {
    try {
        const mainDivXPath = '//div[contains(@class, "AE8xFb OrqRRb GvcuGe goTdfd")]';

        const { details, updatedInitialSpeak, newSeenParticipants, logInfo } = await page.evaluate((mainDivXPath, initialSpeak, seenParticipants) => {
            const details = [];
            const seenParticipantsMap = new Map(JSON.parse(seenParticipants));
            const mainDivNodes = document.evaluate(mainDivXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            const logInfo = [];

            for (let i = 0; i < mainDivNodes.snapshotLength; i++) {
                const mainDiv = mainDivNodes.snapshotItem(i);
                const spanXPath = './/span[contains(@class, "zWGUib")]';
                const spanNodes = document.evaluate(spanXPath, mainDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const jsControllerDivXPath = './/div[@jscontroller="ES310d"]';
                const jsControllerDivNodes = document.evaluate(jsControllerDivXPath, mainDiv, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                if (spanNodes.snapshotLength === jsControllerDivNodes.snapshotLength) {
                    for (let j = 0; j < spanNodes.snapshotLength; j++) {
                        const spanNode = spanNodes.snapshotItem(j);
                        const spanText = spanNode ? spanNode.textContent : '';
                        const jsControllerDivNode = jsControllerDivNodes.snapshotItem(j);
                        const classValue = jsControllerDivNode ? jsControllerDivNode.getAttribute('class') : '';

                        // Log the class value and participant information
                        logInfo.push({ participant: spanText, classValue });

                        // Detect actual speaking events based on class names indicating muted
                        const isMuted = classValue.includes('IisKdb GF8M7d  gjg47c KUNJSe x9nQ6') || classValue.includes('IisKdb GF8M7d  gjg47c MNVeFb kT2pkb');

                        if (spanText && !isMuted) {
                            const speakTime = new Date().toISOString();
                            if (!seenParticipantsMap.has(spanText)) {
                                seenParticipantsMap.set(spanText, []);
                            }
                            if (!initialSpeak) {
                                seenParticipantsMap.get(spanText).push(speakTime);
                                initialSpeak = true;
                            } else {
                                initialSpeak = false;
                            }
                            details.push({ speak_time: speakTime, participantname: spanText });
                        }
                    }
                }
            }

            return {
                details,
                updatedInitialSpeak: initialSpeak,
                newSeenParticipants: JSON.stringify(Array.from(seenParticipantsMap.entries())),
                logInfo
            };
        }, mainDivXPath, initialSpeak, JSON.stringify(Array.from(seenParticipants.entries())));

        initialSpeak = updatedInitialSpeak;
        seenParticipants.clear();
        new Map(JSON.parse(newSeenParticipants)).forEach((value, key) => seenParticipants.set(key, value));

        console.log('Log Information:', logInfo); // Log the collected information
        console.log('Extracted Details:', details);
        console.log('Seen Participants:', seenParticipants);
        return { details, seenParticipants };
    } catch (error) {
        console.error('Error extracting details:', error);
        return { details: [], seenParticipants };
    }
}

function getDistinctParticipants(data) {
    const participantsSet = new Set(data.map(entry => entry.participantname));
    return Array.from(participantsSet);
}

// Function to identify transitions
function getTransitions(data, meetingStartTime) {
    const transitions = [];
    const meetingStartTimeMs = new Date(meetingStartTime).getTime();

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    }

    for (let i = 1; i < data.length; i++) {
        if (data[i].participantname !== data[i - 1].participantname) {
            const speakTimeMs = new Date(data[i].speak_time).getTime();
            const relativeSpeakTimeSeconds = (speakTimeMs - meetingStartTimeMs) / 1000; // convert to seconds
            const formattedSpeakTime = formatTime(relativeSpeakTimeSeconds);

            transitions.push({
                previous: data[i - 1].participantname,
                current: data[i].participantname,
                time: formattedSpeakTime
            });
        }
    }

    return transitions;
}

let orderedParticipants = [];
let allParticipants = new Set();
let isParticipantsButtonClicked = false;
let checkInterval=null;
let initialSpeak = false;
let seenParticipants = new Map();
let isRecordingStopped = false;

async function HandleCheckBotPresence(page,participantCheckInterval) {
    try {
        const botName = 'riktam.ai NoteTaker';
        console.log("Variable of isRecording",isRecordingStopped);
        // console.log("Check Interval",checkInterval);
        if (isRecordingStopped) {
            clearInterval(checkInterval);
            clearInterval(participantCheckInterval)
            isRecordingStopped=false;
            isParticipantsButtonClicked=false;
            checkInterval=null;
            allParticipants.clear();
            return { orderedParticipants: [], status: false };
        } else {
            console.log("IsParticipantButtonClicked",isParticipantsButtonClicked);
            if (!isParticipantsButtonClicked) {
                const buttonXPath = '(//button[contains(@class, "VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc")])[2]';
                console.log("If block is executed");

                const buttonClicked = await page.evaluate((xpath) => {
                    const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (button) {
                        button.click();
                        return true;
                    }
                    return false;
                }, buttonXPath);

                if (buttonClicked) {
                    console.log('Button clicked!');
                    isParticipantsButtonClicked = true;
                } else {
                    console.log('Button not found, skipping click operation.');
                }
            }else{
                console.log("Else Participnat button not updated");
            }
            const arrowbutton='(//button[contains(@class,"VYBDae-Bz112c-LgbsSe VYBDae-Bz112c-LgbsSe-OWXEXe-SfQLQb-suEOdc hk9qKe  S5GDme gVYcob")])[2]';
            const arrowButtonExists = await page.evaluate((xpath) => {
                const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (button) {
                    button.click();
                    return true;
                }
                return false;
            }, arrowbutton);

            if (arrowButtonExists) {
                isParticipantsButtonClicked = true;
                console.log('Arrow button exists in the document.');
            } else {
                console.log('Arrow button does not exist in the document.');
            }

            if (!checkInterval) {
                checkInterval = setInterval(async () => {
                    if (isParticipantsButtonClicked) {
                        console.log("Executed Line 603");
                        if (!page.mainFrame().isDetached()) {
                            const { details, seenParticipants: newSeenParticipants } = await extractMicDetails(page, initialSpeak, seenParticipants);
                            seenParticipants = newSeenParticipants;
                            orderedParticipants = [...orderedParticipants, ...details];
                            console.log("Details",details);
                        } else {
                            console.log('Frame is detached, stopping interval.');
                            clearInterval(checkInterval);
                        }
                    }
                }, 1000); // Capture details every second
            }else{
                console.log("Check Interval is not cleared");
            }

            console.log("Ordered Participants:", orderedParticipants);

            const frame = page.mainFrame();
            if (!frame.isDetached()) {
                const { participants, leftMeetingText } = await frame.evaluate(() => {
                    const leftMeetingElement = document.querySelector('h1[jsname="r4nke"].roSPhc');
                    const leftMeetingText = leftMeetingElement ? leftMeetingElement.textContent : null;
                    const participants = [];
                    const participantElements = document.querySelectorAll('div.dwSJ2e');
                    participantElements.forEach(participant => {
                        const participantName = participant.innerText;
                        participants.push(participantName);
                    });
                    return { participants, leftMeetingText };
                });

                participants.forEach(participant => {
                    allParticipants.add(participant);
                });

                console.log('All Participants:', allParticipants);
                console.log('Participants:', participants);
                console.log('Meeting status:', leftMeetingText);

                if (leftMeetingText || participants.length === 1) {
                    clearInterval(checkInterval);
                    clearInterval(participantCheckInterval)
                    allParticipants.clear();
                    return { orderedParticipants: orderedParticipants || [], status: true };
                }
            }
            return { orderedParticipants:  orderedParticipants|| [], status: false };
        }
    } catch (error) {
        console.error('Error checking bot presence:', error);
        clearInterval(checkInterval);
        return { orderedParticipants: [], status: true };
    }
}


async function HandelScheduleEventList(req, res) {
    try {
        const { userEmail } = req.body
        const user = await User.findOne({ email: userEmail })
        // // Check if user exists and has events

        if (user) {
            if (user.scheduleEvents.length > 0) {
                // If user exists and has events, send the list of events
                const alleventslist = user.scheduleEvents.map(event => event);
                res.status(200).json({ message: 'All Events are listed', alleventslist });
            } else {
                // If user exists but has no events, send a custom message
                res.status(200).json({ message: 'No events found for the user.' });
            }
        } else {
            // If user doesn't exist, send a message indicating user not found
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
}
async function HandelLiveEventList(req, res) {
    try {
        const { userEmail } = req.body
        const user = await User.findOne({ email: userEmail })
        // // Check if user exists and has events

        if (user) {
            if (user.liveEvents.length > 0) {
                // If user exists and has events, send the list of events
                const alleventslist = user.liveEvents.map(event => event);
                res.status(200).json({ message: 'All Events are listed', alleventslist });
            } else {
                // If user exists but has no events, send a custom message
                res.status(200).json({ message: 'No events found for the user.' });
            }
        } else {
            // If user doesn't exist, send a message indicating user not found
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function HandleMeetingdetails(req, res) {
    try {
        const { meetingId, userEmail } = req.body;
        console.log("Meeting Details in Handle Meeting",meetingId);
        let meeting = await Meeting.findOne({ meetingId });
        // console.log("meetingdetails",meeting);

        if (meeting) {
            if (meeting.assemblytranscritps != '') {
                // console.log("iam executed")
                const videoaccess_url = await HandleVideoStream(meetingId);
                const audioaccess_url = await handleAudioStream(meetingId);
                if(meeting.MappedTranscript.length===0){
                    console.log("i am excuteded")
                    const mappedTranscripts = mapTheSpeakerNames(meeting)
                 }
                // const mappedTranscripts = mapTheSpeakerNames(meeting)
                // console.log("this is from meetingdetails",mappedTranscripts)
                // console.log(meeting)
                return res.status(200).json({ meeting, videoaccess_url, audioaccess_url });
            } else {
                // const videoExists = await checkVideoExists(process.env.S3_BUCKET_NAME, meetingId);
                // const bucketName = process.env.S3_BUCKET_NAME;
                // const downloadDir = './downloadfroms3/video';
                // const videoPath = await downloadvideoFromS3(bucketName, meetingId, downloadDir);
                // const audioOutputDir = path.dirname(videoPath);
                const speakerLength = meeting.orderedSpeaker.length;

                console.log("Speaker Length", speakerLength);

                // Extract audio from the video file
                // const audioPath = await getAudio(videoPath, audioOutputDir);
               

                audioPath=report/video/`MeetingId_${meetingId}.mp3`
                console.log(audioPath);
                const result = await generateMultiSpeakerTranscription(audioPath, speakerLength)
                console.log(result)

                meeting.assemblytranscritps = result;
                const audios3Url = await uploadAudioToS3(audioPath, process.env.S3_BUCKET_NAME, meetingId);

                await meeting.save();
                const videoaccess_url = await HandleVideoStream(meetingId);
                const audioaccess_url = await handleAudioStream(meetingId);
                // removeAllFilesInDirectory('./downloadfroms3/video');
                // const filePath = './report/video';
                // removeAllFilesInDirectory('./report/video');
                removeSpecificFile('./report/video', `meetingId_${meetingId}.mp3`);
                const mappedTranscripts =await mapTheSpeakerNames(meeting)
                return res.status(200).json({ meeting, videoaccess_url, audioaccess_url });

            }

        } else {
            const user = await User.findOne({ email: userEmail });
            // If user exists and has events
            if (user && user.events.length > 0) {
                // Search for the event with the matching meetingId
                const event = user.events.find(event => event.MeetingId === meetingId);
                // If event is found, send the event
                if (event) {
                    return res.status(200).json({ message: 'Event found', event });
                }
                // If event is not found in user's events
                return res.status(404).json({ message: 'Event not found in user\'s events' });
            }
            return res.status(404).json({ message: 'User has no events' });

        }

    } catch (error) {
        console.error('Error fetching meeting details:', error);
        return res.status(500).json({ error: 'An error occurred while fetching meeting details' });
    }
}

// function removeAllFilesInDirectory(directoryPath) {
//     fs.readdir(directoryPath, (err, files) => {
//         if (err) {
//             console.error('Error reading directory:', err);
//             return;
//         }

//         for (const file of files) {
//             fs.unlink(path.join(directoryPath, file), err => {
//                 if (err) {
//                     console.error('Error deleting file:', err);
//                 }
//             });
//         }
//     });
// }

function removeSpecificFile(directoryPath, fileName) {
    const filePath = path.join(directoryPath, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log(`File ${fileName} was deleted successfully`);
    });
}




const mapTheSpeakerNames = async (meeting) => {
    const { assemblytranscritps, orderedSpeaker, orderSpeakerTimeBasis } = meeting;
  
    // Create a mapping of speaker letters to indices
    const speakerLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const speakers = {};
  
    // Assign letters to each speaker
    assemblytranscritps.transcriptionData.forEach((dialogue) => {
      if (!(dialogue.speaker in speakers)) {
        speakers[dialogue.speaker] = speakerLetters[Object.keys(speakers).length];
      }
    });
  
    const speakersKeys = Object.keys(speakers);
    const speakerNameMap = {};
    let anonymousCount = 1;
  
    // Map orderedSpeaker names to speaker letters
    orderedSpeaker.forEach((name, index) => {
      if (speakersKeys[index]) {
        speakerNameMap[speakersKeys[index]] = name;
      }
    });
  
    // Assign Anonymous labels for additional speakers
    speakersKeys.forEach((letter) => {
      if (!(letter in speakerNameMap)) {
        speakerNameMap[letter] = Anonymous `${anonymousCount++}`;
      }
    });
  
    const mappedTranscripts = assemblytranscritps.transcriptionData.map((entry, index) => {
      let speakerName;
      if (orderSpeakerTimeBasis.length > 0) {
        const timeBasis = orderSpeakerTimeBasis[index] || {};
        speakerName = timeBasis.previous || orderedSpeaker[index % orderedSpeaker.length];
      } else {
        speakerName = orderedSpeaker[index % orderedSpeaker.length];
      }
  
      return {
        ...entry,
        speakerName: speakerNameMap[entry.speaker] || Anonymous `${anonymousCount++}`,
      };
    });
  
    // Update the meeting document
    meeting.MappedTranscript = mappedTranscripts;
    await meeting.save();
  
    return mappedTranscripts;
  };
  
const AWS = require('aws-sdk');
const { log } = require('console');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

// Set your AWS credentials (either through environment variables or programmatically)
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1' // Change the region if necessary
});

// Create an S3 client
const s3 = new AWS.S3();

// Function to get transcription JSON from S3 bucket
async function getTranscriptionJsonFromS3(bucketName, objectKey) {
    try {
        const params = {
            Bucket: bucketName,
            Key: objectKey
        };
        const response = await s3.getObject(params).promise();
        const transcriptionJson = JSON.parse(response.Body.toString());
        console.log(transcriptionJson.results.transcripts[0].transcript);
        console.log(transcriptionJson.results.items[0]);
        //   console.log(transcriptionJson.results.speaker_labels.segments[0].items);
        return transcriptionJson;
    } catch (err) {
        console.error('Error fetching transcription JSON from S3:', err);
        throw err;
    }
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv() // Automatically fetch credentials from environment variables
});

const HandleUpdateMappedTranscripts = async (req, res) => {
    const { meetingId, UpdatedMappedTranscript } = req.body;
  
    console.log('Received request to update mappedTranscript:', req.body);
  
    try {
      // Update the meeting using findOneAndUpdate
      const updatedMeeting = await Meeting.findOneAndUpdate(
        { meetingId },
        { $set: { MappedTranscript: UpdatedMappedTranscript } },
        { new: true } // Return the updated document
      );
  
      if (!updatedMeeting) {
        console.log('Meeting not found');
        return res.status(404).json({ error: 'Meeting not found' });
      }
  
      console.log('Updated meeting:', updatedMeeting);
      res.json(updatedMeeting);
    } catch (error) {
      console.error('Error updating mapped transcript:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
module.exports = {
    HandleScheduleEvent,
    HandelScheduleEventList,
    HandelLiveEventList,
    HandleMeetingdetails,
    HandleVideoStream,
    HandleLiveMeeting,
    HandleUpdateMappedTranscripts
}