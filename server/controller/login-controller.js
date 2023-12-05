const axios = require('axios');
const { google } = require('googleapis');
const User = require('../modal/UserModal');
// const { getClient } = require('../oAuth/googleOAuthData');

const SCOPES = ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'];

// let authed = false;

const login = async (req, res) => {
    
    try {
        const oAuth2Client = getClient(); // Get a new OAuth2Client instance for each user
        req.session.oAuth2Client = oAuth2Client;
        // console.log('Session ID in login:', req.sessionID);
        // console.log('userOAuth2Client in Login:', req.session);
        // const authUrl = userOAuth2Client.generateAuthUrl({
        //     access_type: 'offline',
        //     scope: SCOPES,
        // });
        // res.send({ url: authUrl });

        // Rest of your login logic using userOAuth2Client
        const oauth2 = google.oauth2({
            version: 'v2',
            auth: req.oAuth2Client,
        });
        // console.log('userOAuth2Client in login:', req.session.userOAuth2Client);

        const userInfo = await oauth2.userinfo.get();
        const { id, name, picture } = userInfo.data;

        await addUser(userInfo.data, res);

        return res.status(200).send({ id, name, pic: picture });
    } catch (error) {
        console.error('Error in login:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const googleCallback = async (req, res) => {
    try {
        const code = req.query.code;
        // console.log('Session ID in Callback:', req.sessionID);
        // console.log('userOAuth2Client in Callback:', req.session);

        if (code) {
            // const userOAuth2Client = req.session.userOAuth2Client;
            const { tokens } = await req.oAuth2Client.getToken(code);
            console.log('Callback Tokens: Successfully Authenticated', tokens);
            req.oAuth2Client.setCredentials(tokens);
            // authed = true;
            return res.redirect('http://localhost:3000');
        } else {
            return res.status(400).json({ error: 'Bad Request' });
        }
    } catch (error) {
        console.error('Error in Google Callback:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addUser = async (userData, response) => {
    try {
        const exist = await User.findOne({ id: userData.id });

        if (!exist) {
            const newUser = new User(userData);
            await newUser.save();
            console.log('New user created:', newUser);
        }
    } catch (error) {
        console.error('Error in addUser:', error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUser = async (request, response) => {
    try {
        const users = await User.find({});
        response.status(200).json(users);
    } catch (error) {
        console.error('Error in getUser:', error.message);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};

const logout = (req, res) => {
    try {
        authed = false;
        res.status(200).send('Logout successful');
    } catch (error) {
        console.error('Error in logout:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const isAuthed = () => {
    return authed;
};

module.exports = { login, googleCallback, addUser, getUser, logout, isAuthed };
