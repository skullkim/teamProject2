const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

require('dotenv').config();

exports.isLoggedIn = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/?error=you have to login first');
}

exports.isNotLoggedIn = (req, res, next) => {
    !req.isAuthenticated() ? next() : res.redirect('/?error=you already logged in');
}

exports.AwsConfig = AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: `${process.env.AWS_region}`,
});

exports.uploadProfileImage = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: `${process.env.AWS_S3_BUCKET}`,
        key(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, `upload/profile/local/${path.basename(file.originalname, ext) + Date.now() + ext}`);
        },
    }),
});

