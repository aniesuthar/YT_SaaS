const { oAuth2Client } = require("../oAuth/googleOAuthData");
const { google } = require('googleapis');
const User = require('../modal/UserModal')


var authed = false;
var currentUser;

var scopes = ['profile', 'email', 'openid',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
]


module.exports.login = (req, res) => {
    try {
        if (!authed) {
            //generate a Auth URL

            var url = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes

            })
            res.send({ url, authed });
        } else {
            console.log('Authrized Entry');
            // res.send({authed});
            var oauth2 = google.oauth2({
                version: 'v2',
                auth: oAuth2Client
            })

            oauth2.userinfo.get(async (err, response) => {
                if (err) throw err;
                var name = response.data.name;
                var pic = response.data.picture;
                var id = response.data.id;


                await addUser(response.data, res);
                currentUser = response.data.id;
                
                res.status(200).send({ authed, id , name, pic });
            })
        }
    } catch (error) {
        response.status(500).json(error);
    }

}

module.exports.googleCallback = (req, res) => {

    const code = req.query.code;

    if (code) {
        oAuth2Client.getToken(code, (err, tokens) => {
            if (err) throw err;

            console.log("Callback Tokens: Successfully Authenticated", tokens);
            oAuth2Client.setCredentials(tokens);
            authed = true;
            // res.send(authed);
            res.redirect('http://localhost:3000');
        })
    }
}

const addUser = async (userData, response) => {
    try {
        let exist = await User.findOne({ id: userData.id });

        if (exist) {
            console.log('user already exists');
            return userData;
        }

        const newUser = new User(userData);
        await newUser.save();
        console.log("New user created:", newUser);
    } catch (error) {
        response.status(500).json("Error in addUser", error);
    }
}

module.exports.getUser = async (request, response) => {
    try {
        const user = await User.find({});
        response.status(200).json(user);
    } catch (error) {
        response.status(500).json(error);
    }
}

module.exports.logout = (req, res) => {
    try {
        // Clear authentication state and user data
        authed = false;
        currentUser = null;
        
        res.status(200).send('Logout successful');
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.isAuthed = () => {
    return authed;
}