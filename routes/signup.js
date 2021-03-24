const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const{isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res, next) => {
    try{
        res.render('signup', {is_logged_in: false});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/confirm-signup', isNotLoggedIn, async(req, res, next) => {
    try{
        const {name, email, age, passwd1} = req.body;
        const ex_user = await User.findOne({
            where: {email}
        });
        if(ex_user){
            res.set({
                'content-type': 'application/json',
                'Cache-Control': 'no-cache',
            });
            res.send({err: 'you already signed up'})
        }
        else{
            const same_name = await User.findOne({
                where: {name}
            });
            if(same_name){
                res.set({
                    'content-type': 'application/json',
                    'Cache-Control': 'no-cache',
                });
                res.send({err: 'same user name exist'});
            }
            else{
                const password = await bcrypt.hash(passwd1, 12);
                await User.create({
                    name,
                    password,
                    email,
                    age,
                });
                res.set({
                    'content-type': 'text/html',
                    'Cache-Control': 'no-cache',
                });
                res.redirect(201, '/');
            }
        }

    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;