const axios = require('axios');
const { google } = require('googleapis');

// let authed = false;

const getLoggedinUser = async (req, res) => {

    try {
        const oauth2 = google.oauth2({
            version: 'v2',
            auth: req.oAuth2Client,
        });
        // console.log('userOAuth2Client in login:', req.session.userOAuth2Client);

        const userInfo = await oauth2.userinfo.get();
        const { id, name, picture } = userInfo.data;

        return res.status(200).send({ id, name, pic: picture });
    } catch (error) {
        console.error('Error in getUser:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = getLoggedinUser;