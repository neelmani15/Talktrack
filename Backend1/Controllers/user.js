const { google } = require('googleapis');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const axios = require('axios');
const User = require('../Models/userSchema.js');
const Meeting=require('../Models/MeetRecord.js');

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

async function HandleScheduleEvent(req,res){
    console.log(req.body.formData);
    // const code = req.query;
    // console.log(code);
    // const {tokens}= await oauth2Client.getToken(code);
    // oauth2Client.setCredentials(tokens);
    // console.log(oauth2Client.credentials);
    console.log(oauth2Client.credentials.access_token)
    console.log(oauth2Client)
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
}

 async function HandelEventList(req, res) {
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
}

 async function HandleMeetingdetails(req, res){
    try {
      const { meetingId } = req.query;
  
      const meeting = await Meeting.findOne({ meetingId });
  
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      res.status(200).json(meeting);
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      res.status(500).json({ error: 'An error occurred while fetching meeting details' });
    }
  }
  
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv() // Automatically fetch credentials from environment variables
});

async function HandleVideoStream(req, res){
  const { meetingId } = req.params;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `recorded_video_MeetingId_${meetingId}.webm`
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration
    res.json({ url });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Error generating presigned URL" });
  }
}

module.exports={
    HandleScheduleEvent,
    HandelEventList,
    HandleMeetingdetails,
    HandleVideoStream
}