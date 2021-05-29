const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Token = require('../models/token');
const axios = require('axios');
const AWS = require('aws-sdk');
const{isLoggedIn, isNotLoggedIn, AwsConfig} = require('./middlewares');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res, next) => {
    try{
        res.render('login', {is_logged_in: false});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

//confirm local login
router.post('/confirm-login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirec: '/login',
    }, (auth_error, user, info) => {
        if(auth_error){
            console.error(auth_error);
            return next(auth_error);
        }
        if(!user){
            res.send(info);
        }
        else{
            return req.login(user, (login_error) => {
                if(login_error){
                    console.error(login_error);
                    return next(login_error);
                }
                return res.redirect('/');
            });
        }
    })(req, res, next);
});

//find password(change password)
router.get('/new-password', isNotLoggedIn, (req, res, next) => {
    try{
        res.render("change-password", {is_logged_in: false});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/confirm-new-password', isNotLoggedIn, async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const ex_user = await User.findOne({
            where: {email},
        });
        if(ex_user){
            const hash_passwd = await bcrypt.hash(password, 12);
            await User.update({
                password: hash_passwd,
            },{
                where: {email}
            });
            res.send('success');
        }
        else{
            res.send({err: 'incorrect email address'});
        }
    }

    catch(err){
        console.error(err);
        next(err);
    }
})

//kakao login
router.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

//github login
router.get('/github', isNotLoggedIn, passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

router.get('/logout', isLoggedIn, async (req, res, next) => {
    const {id, login_as, api_id, profile_key} = req.user;
    const token = await Token.findOne({
        where: {user: id}
    });
    if(login_as === 'kakao' || login_as === 'github'){
        const s3 = new AWS.S3();
        s3.deleteObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${profile_key}`,
        }, (err, data) => {
            err ? console.error(err) : console.log(`${login_as} profile image deleted`);
        });
    }
    if(login_as === 'kakao'){
        const logout_url = `${process.env.KAKAO_LOGOUT}?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.KAKAO_LOGOUT_REDIRECT}`;
        axios({
            method: 'get',
            url: `${logout_url}`,
            headers: {
                HOST: 'kauth.kakao.com',
            }
        })
            .then((response) => {
                console.log(`kakao logout success ${response}`);
            })
            .catch((err) => {
                console.error(err);
                next(err);
            });
    }
    await Token.destroy({
        where: {user: id}
    });
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;