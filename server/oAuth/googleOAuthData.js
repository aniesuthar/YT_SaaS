// var OAuth2Data = require('../credentials/credentials092.json');
// const { google } = require('googleapis');

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];




// //handeling Authentication
// module.exports.oAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URL
// )

const { google } = require('googleapis');
const OAuth2Data = require('../credentials/credentials092.json');

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const getClient = () => {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
};

module.exports = { getClient };
