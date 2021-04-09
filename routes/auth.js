const express = require('express');
const AWS = require('aws-sdk');
const{isLoggedIn, isNotLoggedIn, AwsConfig} = require('./middlewares');

const router = express.Router();

router.get('/posting', isLoggedIn, (req, res, next) => {
    try{
        res.render('new-posting', {is_logged_in: true});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    try{
        const {name} = req.user.dataValues;
        res.render('profile', {is_logged_in: true, user_name: name});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/profile-img', isLoggedIn, (req, res, next) => {
    try{
        const s3 = new AWS.S3();
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${process.env.DEFAULT_PROFILE_IMG_KEY}`,
        }, (err, data) => {
            if(err){
                console.error(err);
            }
            else{
                res.write(data.Body, 'binary');
                res.end(null, 'binary');
            }
        });
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/main-logo', (req, res, next) => {
    try{
        const s3 = new AWS.S3();
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${process.env.MAIN_LOGO_KEY}`,
        }, (err, data) => {
            if(err){
                console.error(err);
            }
            else{
                res.write(data.Body, 'binary');
                res.end(null, 'binary');
            }
        });
    }
    catch(err){

    }
})

module.exports = router;