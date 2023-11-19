var express = require('express');
var OAuth2Data = require('./credentials092.json');
const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');




var app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// import { Server } from 'socket.io';

const io = new Server(8000, {
    cors: {
        origin: "http://localhost:3000",
    },
})


const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

var title, description, tags, progressString;



//handeling Authentication
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
)

var authed = false;

var scopes = ['https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
]

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000', // Update with your front-end URL
}));

const upload = multer();
app.use(upload.array());
app.use(express.json());










app.get('/auth/google/callback', (req, res) => {

    const code = req.query.code;

    if (code) {
        oAuth2Client.getToken(code, (err, tokens) => {
            if (err) throw err;

            console.log("Successfully Authenticated");
            oAuth2Client.setCredentials(tokens);
            authed = true;
            // res.send(authed);
            res.redirect('http://localhost:3000');
        })
    }
})


app.get('/', (req, res) => {

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

        oauth2.userinfo.get((err, response) => {
            if (err) throw err;
            var name = response.data.name;
            var pic = response.data.picture;

            res.send({ authed, name, pic })
        })
    }

});


app.get('/get-channel-info', async (req, res) => {
    try {
        if (!authed) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Call the getChannels function and pass the oAuth2Client
        const channels = await getChannels(oAuth2Client);
        res.json({ channels });
    } catch (error) {
        console.error('Error fetching channel information:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get channel information
// function getChannels(oAuth2Client) {
//     const service = google.youtube('v3');
//     service.channels.list({
//         auth: oAuth2Client,
//         part: 'snippet,contentDetails,statistics',
//         mine: true,
//     }, (err, response) => {
//         if (err) {
//             console.log('The API returned an error: ' + err);
//             return;
//         }
//         const channels = response.data.items;
//         if (channels.length === 0) {
//             console.log('No channel found.');
//         } else {
//             console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
//                 'it has %s views.',
//                 channels[0].id,
//                 channels[0].snippet.title,
//                 channels[0].statistics.viewCount);
//         }
//     });
// }

async function getChannels(oAuth2Client) {
    const service = google.youtube('v3');
    return new Promise((resolve, reject) => {
        service.channels.list({
            auth: oAuth2Client,
            part: 'snippet,contentDetails,statistics',
            mine: true,
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            }
            const channels = response.data.items;
            if (channels.length === 0) {
                console.log('No channel found.');
                reject(new Error('No channel found'));
            } else {
                console.log('Channels:', channels);
                resolve(channels);
            }
        });
    });
}


app.post('/upload', async (req, res) => {
    console.log(req.body);
    title = req.body.title
    description = req.body.desc
    VDlink = req.body.link

    const youtube = google.youtube({
        version: 'v3',
        auth: oAuth2Client
    })

    try {
        const response = await axios.get(VDlink, { responseType: 'stream' });

        const fileSize = parseInt(response.headers['content-length'], 10);
        let uploadedBytes = 0;
        let previousLineLength = 0;
        const chunkSize = 1024 * 1024; // 1 MB chunks


        const media = {
            body: response.data
        };

        const request = youtube.videos.insert({
            resource: {
                snippet: {
                    title: title,
                    description: description,
                    tags: ["anil", "anil2", "anil3"]
                },
                status: {
                    privacyStatus: "private"
                },
            },
            part: "snippet, status",
            media: media
        });
        const chunks = [];

        response.data.on('data', chunk => {
            chunks.push(chunk);
            uploadedBytes += chunk.length;

            const progress = (uploadedBytes / fileSize) * 100;
            progressString = `Upload Progress: ${progress.toFixed(2)}%`;
            process.stdout.write('\r' + progressString.padEnd(previousLineLength, ' '));
            previousLineLength = progressString.length;

            io.emit('progress', { progressString });
        });
        // console.log(`Upload Progress: ${progress.toFixed(2)}%`);

        // });

        response.data.on('end', async () => {
            media.body = Buffer.concat(chunks);

            // Execute the request
            try {
                const result = await request;
                console.log("\nUploading video done");
                res.send({ message: `Video uploaded with ID: ${result.data.id}`, progressString });
            } catch (error) {
                console.error('Error uploading video:', error.message);
                res.status(500).send('Error uploading video');
            }
        });
    } catch (error) {
        console.error('Error uploading video:', error.message);
        res.status(500).send('Error uploading video');
    }
})



io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle WebSocket events here
    // You can emit messages or updates to connected clients
    // For example: socket.emit('progress', { progressString });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


app.listen(5000, () => {
    console.log("App is listening on Port 5000");
});


