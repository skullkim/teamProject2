const express = require('express');
const {isLoggedIn} = require('./middlewares');
const Posting = require('../models/postings');
const User = require('../models/users');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        res.render('letters', {is_logged_in: req.isAuthenticated()});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/written', (req, res, next) => {
    try{
        res.render('posting', {is_logged_int: req.isAuthenticated()});
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/letter-context', async (req, res, next) => {
    try{
        const written = req.query.written;
        const context = await Posting.findOne({
            where: {id: written},
        });
        const id = context.dataValues.author;
        const ex_user = await User.findOne({
            where: {id},
        });
        context.dataValues.author = ex_user.name;
        res.send(JSON.stringify(context.dataValues));
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;