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
        
        // res.status(200).json({ message: 'User Login successfully.' });
        res.redirect('http://localhost:3000/login/success',{ data });
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


module.exports={
    HandelGoogleAuthentication,
    HandleGcallback
 }