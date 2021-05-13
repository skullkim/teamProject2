const express = require('express');
const path = require('path');
const AWS = require('aws-sdk');
const{AwsConfig} = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        req.isAuthenticated() ? res.render('index', {is_logged_in: true}) : res.render('index', {is_logged_in: false});
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
        console.error(err);
        next(err);
    }
});

router.get('/footer-img', async(req, res, next) => {
    try{
        const s3 = new AWS.S3();
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${process.env.FOOTER_LOGO_KEY}`,
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
})

module.exports = router;