const express = require('express');
const AWS = require('aws-sdk');
const{isLoggedIn, isNotLoggedIn, AwsConfig} = require('./middlewares');
const User = require("../models/users");
const bcrypt = require('bcrypt');

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
        const {name, login_as} = req.user.dataValues;
        const local_login = login_as ? false : true;
        res.render('profile', {is_logged_in: true, user_name: name, local_login});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/profile-img', isLoggedIn, (req, res, next) => {
    try{
        const s3 = new AWS.S3();
        const {profile_key} = req.user;
        const s3_key = profile_key ? profile_key : process.env.DEFAULT_PROFILE_IMG_KEY;
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${s3_key}`,
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
        console.error(err);
        next(err);
    }
});

router.get('/edit-password', isLoggedIn, (req, res, next) => {
    try{
        res.render('edit-password', {is_logged_in: true});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/confirm-edit-password', isLoggedIn, async (req, res, next) => {
    try{
        const {prev_passwd, new_passwd, login_as} = req.body;
        const {id, password} = req.user;
        const result = await bcrypt.compare(prev_passwd, password);
        if(!result){
            res.send({err: 'incorrect previous password'});
            return;
        }
        const new_password = await bcrypt.hash(new_passwd, 12);
        await User.update(
            {password: new_password},
            {where: {id}},
        );
        res.end();
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;