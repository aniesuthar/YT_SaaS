var express = require('express');
const Connection  = require('./database/db.js');
const session = require('express-session');
const  cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { getClient } = require('./oAuth/googleOAuthData.js');


var app = express();


app.use(
    session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
    })
);


// Initialize the OAuth2 client instance
const oAuth2Client = getClient();

// Middleware to set the OAuth2 client in the request object
app.use((req, res, next) => {
    req.oAuth2Client = oAuth2Client;
    next();
});

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', // Update with your front-end URL
}))



const upload = multer();
app.use(upload.array());
app.use(express.json());


app.use('/', route)




Connection();




app.listen(5000, () => {
    console.log("App is listening on Port 5000");
});