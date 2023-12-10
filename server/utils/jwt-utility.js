const jwt = require("jsonwebtoken");
const config = require("config");

const privateKey = config.get("privateKey");
const publicKey = config.get("publicKey");

function signJwt(object, options) {
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

async function verifyJwt(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, (error, decoded) => {
            if (error) {
                console.error("JWT Verification Error:", error.message);
                reject(error);
            } else {
                console.log("JWT Decoded Successfully:", decoded);
                return resolve({
                    valid: true,
                    expired: false,
                    decoded,
                });
            }
        });
    });
}


module.exports = {
    signJwt,
    verifyJwt,
};
