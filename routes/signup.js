const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.route('/').get((req, res, next) => {
    try{
        res.render('signup');
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/confirm-signup', async(req, res, next) => {
    try{
        const {name, email, age, passwd1} = req.body;
        const ex_user = await User.findOne({
            where: {email}
        });
        if(ex_user){
            res.setHeader('content-type', 'application/json');
            res.send({err: 'you already signed up'})
        }
        else{
            const same_name = await User.findOne({
                where: {name}
            });
            if(same_name){
                res.setHeader('content-type', 'application/json');
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
                res.setHeader('content-type', 'text/html');
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