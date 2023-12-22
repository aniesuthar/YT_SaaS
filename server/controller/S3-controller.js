const { BUCKET, s3 } = require("../utils/s3-utility");

async function S3upload(req, res, next) {

    try {
        console.log('Successfully uploaded ' + req.file.location + ' location!');
        console.log("File  is:", req.file);
        // const fileResponse = { URL : req.file.location, key:  req.file.key}
        res.send(req.file.key);

    } catch (error) {
        console.error(" Error in upload to S3 ", error);
    }

}


async function S3getFile(req, res, next) {

    const key = req.params.key;
    // const key = encodeURIComponent(k);


    console.log("S3getFile hit!!!!!!!!!!!!!  Key:", key);



    // Check if the user has permission to access the object
    // You might use your own logic to determine if the user is the uploader or has the right permissions

    /* Check if the user has permission, e.g., user.userId === uploader.userId  >>>>>> IF Condition  */
    if (true) {
        // Serve the S3 object directly to the user
        const params = {
            Bucket: BUCKET,
            Key: key,
        };

        try {
            await s3.headObject(params).promise();
            const s3Stream = s3.getObject(params).createReadStream();
            // res.setHeader('Content-Type', headObjectResponse.ContentType); // Set the content type based on S3 metadata
            s3Stream.pipe(res);
            // const imageURL = `http://localhost:5000/getfile-S3/${key}`;
            // res.json({ imageURL });
        } catch (error) {
            console.error('Error serving S3 object:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(403).json({ message: 'Permission denied' });
    }

}


module.exports = { S3upload, S3getFile };