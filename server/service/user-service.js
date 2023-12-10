const { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } = require("mongoose");
const qs = require("qs");
const config = require("config");
const axios = require("axios");
const { omit } = require("lodash");
const User = require("../modal/UserModal");


const OAuth2Data = require('../credentials/credentials092.json');
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

async function createUser(input) {
    try {
        const user = await User.create(input);
        return omit(user.toJSON(), "password");
    } catch (e) {
        throw new Error(e);
    }
}

async function validatePassword({ email, password }) {
    const user = await User.findOne({ email });

    if (!user) {
        return false;
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) return false;

    return omit(user.toJSON(), "password");
}

async function findUser(query) {
    return User.findOne(query).lean();
}

async function getGoogleOAuthTokens({ code }) {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        // client_id: config.get("googleClientId"),
        // client_secret: config.get("googleClientSecret"),
        // redirect_uri: config.get("googleOauthRedirectUrl"),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post(
            url,
            qs.stringify(values),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error(error.response.data.error);
        console.log(error, "Failed to fetch Google Oauth Tokens");
        throw new Error(error.message);
    }
}

async function getGoogleUser({ id_token, access_token }) {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.log(error, "Error fetching Google user");
        throw new Error(error.message);
    }
}

async function findAndUpdateUser(query, update, options = {}) {
    return User.findOneAndUpdate(query, update, options);
}

module.exports = {
    createUser,
    validatePassword,
    findUser,
    getGoogleOAuthTokens,
    getGoogleUser,
    findAndUpdateUser,
};
