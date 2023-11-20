const {mongoose} = require('mongoose');
const dotenv = require('dotenv');
 

const Connection = async () => {

    dotenv.config();

    const mongoURL = process.env.MONGO_URL;


    try {
        await mongoose.connect(mongoURL, { useUnifiedTopology: true });
        console.log("DB Connected");
    }
    catch (error) {
        console.log("Error while connecting with database", error.message);
    }
}

module.exports = Connection;