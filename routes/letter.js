const express = require('express');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        // const is_logged_in = req.isAuthenticated() ? true : false;
        res.render('letters', {is_logged_in: req.isAuthenticated()});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;