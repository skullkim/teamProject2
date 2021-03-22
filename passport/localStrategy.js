const passport = require('passport');
const local_strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/users');

module.exports = () => {
    passport.use(new local_strategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async(email, password, done) => {
        try{
            const ex_user = await User.findOne({
                where: {email},
            });
            if(ex_user){
                const correct_password = await bcrypt.compare(password, ex_user.password);
                console.log(correct_password);
                correct_password ? done(null, ex_user) : done(null, false, {err: 'wrong password'});
            }
            else{
                done(null, false, {err: 'Did not signup yet'});
            }
        }
        catch(err){
            console.error(err);
            done(err);
        }
    }));
}