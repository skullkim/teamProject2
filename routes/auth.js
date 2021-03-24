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

module.exports = router;