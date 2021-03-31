const express = require('express');
const{isLoggedIn, isNotLoggedIn} = require('./middlewares');

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
        console.log(req.user);
        const {name} = req.user.dataValues;
        res.render('profile', {is_logged_in: true, user_name: name});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;