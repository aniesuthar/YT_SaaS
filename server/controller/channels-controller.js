const { oAuth2Client } = require("../oAuth/googleOAuthData");
const { google } = require('googleapis');
const { isAuthed } = require("./login-controller");


module.exports.fetchChannels = async (req, res) => {
    try {
        if (!isAuthed) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Call the getChannels function and pass the oAuth2Client
        const channels = await getChannels(oAuth2Client);
        res.json({ channels });
    } catch (error) {
        console.error('Error fetching channel information:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function getChannels(oAuth2Client) {
    const service = google.youtube('v3');
    return new Promise((resolve, reject) => {
        service.channels.list({
            auth: oAuth2Client,
            part: 'snippet,contentDetails,statistics',
            mine: true,
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            }
            const channels = response.data.items;
            if (channels.length === 0) {
                console.log('No channel found.');
                reject(new Error('No channel found'));
            } else {
                console.log('Channels:', channels);
                resolve(channels);
            }
        });
    });
}