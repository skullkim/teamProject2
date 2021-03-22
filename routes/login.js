const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        res.render('login');
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

//confirm local login
router.post('/confirm-login', async (req, res, next) => {
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirec: '/login',
    }, (auth_error, user, info) => {
        //console.log(1111);
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

module.exports = router;