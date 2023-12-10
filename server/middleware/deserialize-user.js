const { get } = require("lodash");
const { verifyJwt } = require("../utils/jwt-utility");
const { reIssueAccessToken } = require("../service/session-service");

const deserializeUser = async (req, res, next) => {
    const accessToken =
        get(req, "cookies.accessToken") ||
        get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const refreshToken =
        get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

    if (!accessToken) {
        return next();
    }

    console.log("AccessToken from cookies", accessToken);
    const { decoded, expired } = await verifyJwt(accessToken);


    if (decoded) {
        res.locals.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });

        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);

            res.cookie("accessToken", newAccessToken, {
                maxAge: 900000, // 15 mins
                httpOnly: true,
                domain: "localhost",
                path: "/",
                sameSite: "strict",
                secure: false,
            });
        }

        const result = verifyJwt(newAccessToken);

        res.locals.user = result.decoded;
        return next();
    }

    return next();
};

module.exports = deserializeUser;