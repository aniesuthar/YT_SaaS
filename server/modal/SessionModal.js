const mongoose = require("mongoose");
const User = require("./UserModal");


const sessionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: User },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
        tokens: {
            access_token: { type: String }
        },
    },
    {
        timestamps: true,
    }
);

const SessionModel = mongoose.model("Session", sessionSchema);

module.exports = SessionModel;
