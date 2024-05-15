const { google } = require("googleapis")
const dotenv = require("dotenv");
dotenv.config()

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback'
)
// Scopes for accessing Google Drive
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.readonly'
];
  
// Function to get authorization URL
const getAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
}

// Function to exchange code for access token
const getAccessToken  = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens, "its a access token========================");
    return tokens;
}

// Function to get profile data using access token
const getProfileData  = async (access_token) => {
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const res = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,photos',
    });
    return res.data;
}

module.exports = {
    oauth2Client,
    getAuthUrl,
    getAccessToken,
    getProfileData
}