// const { S3Client } = require('@aws-sdk/client-s3');
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

module.exports = { s3,  BUCKET };