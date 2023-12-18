// const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3');
const config = require('config');

const BUCKET = config.get('S3BucketName');

// const S3Creds = {
//     region: config.get('S3Region'),
//     credentials: {
//         secretAccessKey: config.get('S3SecretAccessKey'),
//         accessKeyId: config.get('S3AccessKey')
//     }
// }
// const s3 = new S3Client(S3Creds);


var AWS = require('aws-sdk');


AWS.config.update({

    secretAccessKey: config.get('S3SecretAccessKey'),
    accessKeyId: config.get('S3AccessKey')

});

var s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
            cb(null, `${fileName}${file.originalname}`);
        }
    })
});

module.exports = { upload };