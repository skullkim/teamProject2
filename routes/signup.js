const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        res.render('signup', {message: req.flash('message')});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/confirm-signup', async(req, res, next) => {
    try{
        //console.log(req.body);
        const {name, email, age, passwd1, passwd2} = req.body;
        const ex_user = await User.findOne({
            where: {name}
        });
        if(ex_user){
            req.flash('message', 'you already signed up');
            res.redirect('/signup');
        }
        else{
            const password = await bcrypt.hash(passwd1, 12);
            await User.create({
                name,
                password,
                email,
                age,
            });
            res.redirect('/');
        }

    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;