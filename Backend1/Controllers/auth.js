const { google } = require('googleapis');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const axios = require('axios');
const User = require('../Models/userSchema.js');



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

async function HandelGoogleAuthentication(req,res){

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    // const myUrl = new URL(url); 
    // res.redirect(myUrl);
    res.redirect(url);
}


async  function HandleGcallback(req,res){
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
        const encodedEmail = encodeURIComponent(data.email);
        // res.status(200).json({ message: 'User Login successfully.' });
        // res.redirect('http://localhost:3000/login/success');
        res.redirect(`http://localhost:3000/login/success?email=${encodedEmail}`);
        // const user_info = await axios.get(https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token})
        // console.log(user_info);
        // res.send({
        //     message:"You have successfully logged in"
        // })
    }catch(err){
        console.log("Error in Login",err);
        res.status(404).json({ message: 'Unable to Register User'});
    }
}

 async function HandleFetchevents(req, res)  {
    try {
        const {userEmail}=req.body
        const user = await User.findOne({  email: userEmail});
        oauth2Client.setCredentials({
            access_token:  user.googleAccessToken, 
        });
        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        });
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1); 
        const response = await calendar.events.list({
            calendarId: 'primary', 
            timeMin: now.toISOString(),
            timeMax: oneMonthLater.toISOString(),
            maxResults: 10, 
            singleEvents: true,
            orderBy: 'startTime'
        });
         console.log(response)
        const events = response.data.items;
        if (events.length) {
            console.log('Upcoming events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
            });
            res.json(events);
        } else {
            console.log('No upcoming events found.');
            res.json({ message: 'No upcoming events found.' });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
  }
module.exports={
    HandelGoogleAuthentication,
    HandleGcallback,
    HandleFetchevents
 }