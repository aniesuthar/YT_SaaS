const { google } = require('googleapis');
const axios = require('axios');
const {oAuth2Client} = require('../oAuth/googleOAuthData');
const io = require('../../socket/index');


var title, description, tags, progressString;


module.exports.YTupload = async (req, res) => {
    console.log(req.body);
    title = req.body.title
    description = req.body.desc
    VDlink = req.body.link

    // console.log({nhbh:oAuth2Client});

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

            if (uploadedBytes > 0) {
                io.emit('progress', { progressString });
            }
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
}