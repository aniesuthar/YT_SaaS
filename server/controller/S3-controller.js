async function S3upload(req, res, next) {

    try {
        
        res.send('Successfully uploaded ' + req.file.location + ' location!')

    } catch (error) {
        console.error(" Error in upload to S3 ", error);
    }

}


module.exports = { S3upload };