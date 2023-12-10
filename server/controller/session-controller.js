const { CookieOptions } = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const {
    createSession,
    findSessions,
    updateSession,
} = require("../service/session-service");

const { signJwt } = require("../utils/jwt-utility");
const { getGoogleUser, getGoogleOAuthTokens, findAndUpdateUser } = require("../service/user-service");

const accessTokenCookieOptions = {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "lax",
    secure: false,
};

const refreshTokenCookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 3.154e10, // 1 year
};

async function createUserSessionHandler(req, res) {
    const user = await validatePassword(req.body);

    if (!user) {
        return res.status(401).send("Invalid email or password");
    }

    const session = await createSession(user._id, req.get("user-agent") || "")

    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") }
    );

    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("refreshTokenTtl") }
    );

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.send({ accessToken, refreshToken });
}

async function getUserSessionsHandler(req, res) {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    return res.send(sessions);
}

async function deleteSessionHandler(req, res) {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false });

    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}

async function googleOauthHandler(req, res) {
    const code = req.query.code;

    try {
        const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        console.log({ id_token, access_token });

        const googleUser = await getGoogleUser({ id_token, access_token });

        console.log({ googleUser });

        if (!googleUser.verified_email) {
            return res.status(403).send("Google account is not verified");
        }

        const user = await findAndUpdateUser(
            {
                email: googleUser.email,
            },
            {
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
            },
            {
                upsert: true,
                new: true,
            }
        );

        const session = await createSession(user._id, req.get("user-agent") || "");

        // Store the access_token in the user's session
        await updateSession({ _id: session._id }, { 'tokens.access_token': access_token });

        const accessToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: config.get("accessTokenTtl") }
        );

        const refreshToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: config.get("refreshTokenTtl") }
        );

        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
        res.cookie("access_token", access_token, refreshTokenCookieOptions);

        res.redirect('http://localhost:3000/');
    } catch (error) {
        console.error(error, "Failed to authorize Google user");
        return res.redirect(`${config.get("origin")}/oauth/error`);
    }
}

module.exports = {
    createUserSessionHandler,
    getUserSessionsHandler,
    deleteSessionHandler,
    googleOauthHandler,
};
