var express = require('express');
const Connection  = require('./database/db.js');
// const session = require('express-session');
const cookieParser = require('cookie-parser');
const  cors = require('cors');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { getClient } = require('./oAuth/googleOAuthData.js');
const deserializeUser = require('./middleware/deserialize-user.js');
// const config = require("config");

var app = express();



app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', // Update with your front-end URL
}))



app.use(cookieParser());

app.use(express.json());

app.use(deserializeUser);

app.use('/', route)

// Logging the rejected field from multer error
// app.use((error, req, res, next) => {
//     console.log('This is the rejected field ->', error.field);
// });




Connection();




app.listen(5000, () => {
    console.log("App is listening on Port 5000");
});