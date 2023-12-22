const multer = require('multer')
const multerS3 = require('multer-s3');
const { BUCKET, s3 } = require('../utils/s3-utility');


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