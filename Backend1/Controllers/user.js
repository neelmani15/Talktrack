const { google } = require('googleapis');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const axios = require('axios');
const User = require('../Models/userSchema.js');
const Meeting=require('../Models/MeetRecord.js');
const OpenAI = require("openai");
const fs = require('fs');
const { parseISO, subMinutes, addMinutes, isAfter,isBefore } = require('date-fns');
const { launch, getStream,wss } = require("puppeteer-stream");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const uploadToS3 = require('../Connection/uploadToS3');
const downloadvideoFromS3 = require('../Connection/downloadfroms3');
const uploadAudioToS3  = require('../Connection/uploadaudioToS3');

const { handleAudioStream, HandleVideoStream } = require('../Connection/avaccessurls');
const { startTranscriptionJob, getTranscriptionResult,checkTranscriptionJobExists } = require('../Connection/awstranscribe.js');
const getAudio = require('..//Connection/getaudio');
const GetTranscript=require('../Connection/getTranscript.js');
const checkVideoExists = require('..//Connection/videocheck');
const { trusted } = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const calendar = google.calendar({
    version:"v3",
    auth:process.env.API_KEY
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
          MeetingId:meetingId
          // attendees: attendees
      };
    console.log(alldata)
      user.events.push(alldata);
      await user.save();

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
        if (isAfter(now, botJoinTime) && isBefore(now, endTime)) {
            joined = await HandlejoinMeeting(meetinglink, userEmail);
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


async function HandlejoinMeeting(meetUrl, userEmail) {
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

        const participantCheckInterval = setInterval(async () => {
            const botPresence = await HandleCheckBotPresence(page, browser, meetingId, userEmail);
            if (botPresence || isRecordingStopped) {
                clearInterval(participantCheckInterval);
                await HandleStopRecording(browser, stream, fileStream, meetingId, userEmail);
            }
        },10000)

        // page.on('framenavigated', async (frame) => {
        //     const url = frame.url();
        //     console.log(url);
        //     if (!url.includes('meet.google.com')) {
        //         console.log("Meeting Stopped");
        //         await HandleStopRecording(browser, stream, fileStream,meetingId,userEmail);
        //         return
        //     }
        // });

        // setInterval(async () => {
        //    let answer=await HandleCheckBotPresence(page, browser, stream, fileStream,meetingId,userEmail);
        //    if (answer){
        //     stop=true
        //     return
        //    }
        // }, 10000);
        return true;

        // res.status(200).json({ message: 'Recording started successfully.' });

    } catch (error) {
        console.error('Error starting recording:', error);
        return false;
        // res.status(500).json({ error: 'An error occurred while starting recording.' });
    }
}

async function HandleLiveMeeting(req,res) {
    console.log("Joining Meet");
    const { meetUrl,userEmail } = req.body;
    console.log(meetUrl);
    console.log(userEmail);
    const parts = meetUrl.split('/');
    const meetingId = parts[parts.length - 1];
    // const file = fs.createWriteStream("./report/test2.mp4");

    console.log(meetingId);

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        oauth2Client.setCredentials({
            access_token: user.googleAccessToken,
            // If you have a refresh token, set it here as well
            // refresh_token: user.googleRefreshToken,
        });
        const currentDateTime = new Date();
        const oneHourLater = new Date(currentDateTime.getTime() + (60 * 60 * 1000));
        const alldata = {
            summary: `Live ${meetingId}`,
            description: "Some Topic",
            start: currentDateTime,
            end: oneHourLater,
            url: meetUrl,
            MeetingId:meetingId
            // attendees: attendees
        };
        console.log(alldata)
        user.events.push(alldata);
        await user.save();
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

        const participantCheckInterval = setInterval(async () => {
            const botPresence = await HandleCheckBotPresence(page, browser, meetingId, userEmail);
            if (botPresence || isRecordingStopped) {
                clearInterval(participantCheckInterval);
                await HandleStopRecording(browser, stream, fileStream, meetingId, userEmail);
            }
        },10000)

        // page.on('framenavigated', async (frame) => {
        //     const url = frame.url();
        //     console.log(url);
        //     if (!url.includes('meet.google.com')) {
        //         console.log("Meeting Stopped");
        //         await HandleStopRecording(browser, stream, fileStream,meetingId,userEmail);
        //         return
        //     }
        // });

        // setInterval(async () => {
        //    let answer=await HandleCheckBotPresence(page, browser, stream, fileStream,meetingId,userEmail);
        //    if (answer){
        //     stop=true
        //     return
        //    }
        // }, 10000);
        // return true;

        res.status(200).json({ message: 'Recording started successfully.' });

    } catch (error) {
        console.error('Error starting recording:', error);
        // return false;
        res.status(500).json({ error: 'An error occurred while starting recording.' });
    }
}

async function HandleStopRecording(browser, stream, fileStream,meetingId,userEmail) {
    try {
        stop=true
        stream.unpipe(fileStream);
        fileStream.end();
        console.log("Recording stopped successfully.");
        const s3Url = await uploadToS3(fileStream.path, process.env.S3_BUCKET_NAME,meetingId);
        console.log(s3Url)
        // console.log(userEmail)

        // const videoPath = fileStream.path;
        // const audioOutputDir = path.dirname(videoPath);

        // Extract audio from the video file
        // const audioPath = await getAudio(videoPath, audioOutputDir);
        // const audios3Url = await uploadAudioToS3(audioPath, 'riktam-recordings',meetingId);
        // console.log(audios3Url)
        // const transcription= await GetTranscript(audioPath)
        // const meetingRecord = new Meeting({
        //     userEmail: userEmail,
        //     meetingId: meetingId,
        //     videoS3url: s3Url,
        //     transcript:transcription
        // });
        
        // await meetingRecord.save();
        
        console.log("Meeting record saved successfully.");
        await browser?.close();
        console.log("browser closed")

        isRecordingStopped=true
        
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

let gotItClicked = false;
let isRecordingStopped=false
async function HandleCheckBotPresence(page, browser, stream, fileStream,meetingId,userEmail) {
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

                if (participants.length >= 1) {
                    if (!gotItClicked) {
                        await page.click('span[jsname="V67aGc"].mUIrbf-vQzf8d');
                        console.log('Clicked on "Got it" button');
                        gotItClicked = true;
                    }
                }

                if (leftMeetingText || participants.length === 1){
                    // await HandleStopRecording(browser, stream, fileStream,meetingId,userEmail);
                    return true;
                }


                // if (participants.length === 1) {
                //     gotItClicked = false;
                //     await HandleStopRecording(browser, stream, fileStream,meetingId,userEmail);
                //     return;
                // }
            }
            return false;
        }
    } catch (error) {
            await HandleStopRecording(browser, stream, fileStream,meetingId,userEmail);
            console.error('Error checking bot presence:', error);
            return true;
    }
}

async function HandelEventList(req, res) {
    try {
        // const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        //     headers: {
        //         Authorization: `Bearer ${oauth2Client.credentials.access_token}`
        //     }
        // });

        const {userEmail}=req.body
        const user = await User.findOne({  email: userEmail});
        // oauth2Client.setCredentials({
        //     access_token:  user.googleAccessToken, 
        // });

        // const user = await User.findOne({ googleId: data.id });

        // // Check if user exists and has events
       
        if (user) {
            if (user.events.length > 0) {
                // If user exists and has events, send the list of events
                const alleventslist = user.events.map(event => event);
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

// async function HandleMeetingdetails(req, res){
//     try {
//     const { meetingId,userEmail } = req.body;

//     const meeting = await Meeting.findOne({ meetingId });
//     console.log(meeting)
//     //   if(meeting ){
//     //     var videoaccess_url = await HandleVideoStream(meetingId)
//     //   }
//     if (!meeting) {
//         const user = await User.findOne({  email: userEmail});
//         if (user.events.length > 0) {
//             // If user exists and has events, send the list of events
//             const alleventslist = user.events.map(event => event);
//             console.log(alleventslist)
//             res.status(200).json({ message: 'All Events are listed', alleventslist });
//         }

//         return res.status(404).json({ message: 'Meeting not found' });
//     }
//     //   res.status(200).json(meeting,videoaccess_url);
//     const videoaccess_url = await HandleVideoStream(meetingId);
//     // const transcript=await GetTranscript(meeting.videoS3url)
//     res.status(200).json({ meeting, videoaccess_url});
//     } catch (error) {
//     console.error('Error fetching meeting details:', error);
//     res.status(500).json({ error: 'An error occurred while fetching meeting details' });
//     }
//  }

// async function HandleMeetingdetails(req, res) {
//     try {
//       const { meetingId, userEmail } = req.body;
  
//       // Check if the meeting exists
//       const meeting = await Meeting.findOne({ meetingId });
//       console.log(meeting);
  
//       // If meeting doesn't exist
//       if (!meeting) {
//         // Find the user by email
//         const user = await User.findOne({ email: userEmail });
  
//         // If user exists and has events
//         if (user && user.events.length > 0) {
//           // Search for the event with the matching meetingId
//           const event = user.events.find(event => event.MeetingId === meetingId);
  
//           // If event is found, send the event
//           if (event) {
//             return res.status(200).json({ message: 'Event found', event });
//           }
  
//           // If event is not found in user's events
//           return res.status(404).json({ message: 'Event not found in user\'s events' });
//         }
  
//         // If user has no events
//         return res.status(404).json({ message: 'User has no events' });
//       }
  
//       // If meeting exists
//       const videoaccess_url = await HandleVideoStream(meetingId);
//       return res.status(200).json({ meeting, videoaccess_url });
//     } catch (error) {
//       console.error('Error fetching meeting details:', error);
//       return res.status(500).json({ error: 'An error occurred while fetching meeting details' });
//     }
//   }
  
async function HandleMeetingdetails(req, res) {
    try {
      const { meetingId, userEmail } = req.body;  
      let meeting = await Meeting.findOne({ meetingId });
      console.log(meeting);
  
        if (meeting) {
            const videoaccess_url = await HandleVideoStream(meetingId);
            const audioaccess_url = await handleAudioStream(meetingId);
            return res.status(200).json({ meeting, videoaccess_url,audioaccess_url  });
        }else {
            const videoExists = await checkVideoExists(process.env.S3_BUCKET_NAME, meetingId);
            if(videoExists.exists){
            const bucketName = process.env.S3_BUCKET_NAME;
            const downloadDir = './downloadfroms3/video';
            const videoPath = await downloadvideoFromS3(bucketName, meetingId, downloadDir);
            const audioOutputDir = path.dirname(videoPath);
    
            // Extract audio from the video file
            const audioPath = await getAudio(videoPath, audioOutputDir);
            const audios3Url = await uploadAudioToS3(audioPath, process.env.S3_BUCKET_NAME,meetingId);
            const transcription = await GetTranscript(audioPath);
            console.log(transcription);

            let transcriptionJob = `transcription-job-${meetingId}`

            const transcriptionJobExist = await checkTranscriptionJobExists(transcriptionJob);
                if (transcriptionJobExist) {
                    // If transcription job already exists, get its result
                    const transcriptionResult = await getTranscriptionResult(transcriptionJob);
                    console.log('Transcription result:', transcriptionResult);
                    const transcriptionData = await getTranscriptionJsonFromS3(bucketName, `transcriptions/${meetingId}.json`)
                    console.log("Transcription Data", transcriptionData);
                    // Update the existing meeting record with the new transcript
                    const meeting = new Meeting({
                        userEmail: userEmail,
                        meetingId: meetingId,
                        videoS3url: videoExists.url,
                        transcript: transcription,
                        transcriptionData: transcriptionData
                    });
                    await meeting.save();
                    console.log("Meeting record updated successfully.");

                    const videoaccess_url = await HandleVideoStream(meetingId);
                    const audioaccess_url = await handleAudioStream(meetingId);
                    return res.status(200).json({ meeting, videoaccess_url,audioaccess_url });
                } else {
                    // If transcription job doesn't exist, start a new one
                    const transcriptionJobName = await startTranscriptionJob(audios3Url,meetingId);

                    // Polling for transcription result
                    const transcriptionResult = await getTranscriptionResult(transcriptionJobName);
                    console.log('Transcription result:', transcriptionResult);
                    const transcriptionData = await getTranscriptionJsonFromS3(bucketName, `transcriptions/${meetingId}.json`)
                    console.log("Transcription Data", transcriptionData);
                    // Update the existing meeting record with the new transcript
                    const meeting = new Meeting({
                        userEmail: userEmail,
                        meetingId: meetingId,
                        videoS3url: videoExists.url,
                        transcript: transcription,
                        transcriptionData: transcriptionData
                    });
                    await meeting.save();
                    console.log("Meeting record updated successfully.");

                    const videoaccess_url = await HandleVideoStream(meetingId);
                    const audioaccess_url = await handleAudioStream(meetingId);
                    return res.status(200).json({ meeting, videoaccess_url,audioaccess_url });
                }


            // Update the existing meeting record with the new transcript
            // const meeting = new Meeting({
            //     userEmail: userEmail,
            //     meetingId: meetingId,
            //     videoS3url: videoExists.url,
            //     transcript:transcription
            // });
            // await meeting.save();
            // console.log("Meeting record updated successfully.");
    
            // const videoaccess_url = await HandleVideoStream(meetingId);
            // return res.status(200).json({ meeting, videoaccess_url });

            }
            else{
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
            
        }
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      return res.status(500).json({ error: 'An error occurred while fetching meeting details' });
    }
  }

  const AWS = require('aws-sdk');
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
  
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() // Automatically fetch credentials from environment variables
});



// async function HandleVideoStream(meetingId){

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: `videos/recorded_video_MeetingId_${meetingId}.webm`
//   };
//   try {
//     const command = new GetObjectCommand(params);
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
//     // res.json({ url });
//     return url
//   } catch (error) {
//     console.error("Error generating presigned URL:", error);
//     // res.status(500).json({ error: "Error generating presigned URL" });
//   }
// }

module.exports={
    HandleScheduleEvent,
    HandelEventList,
    HandleMeetingdetails,
    HandleVideoStream,
    HandleLiveMeeting
}