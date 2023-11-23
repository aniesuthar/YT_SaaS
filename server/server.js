var express = require('express');
const Connection  = require('./database/db.js');
const  cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');


var app = express();



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