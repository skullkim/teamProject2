const passport = require('passport');
const githubStrategy = require('passport-github');
const User = require('../models/users');
const Token = require('../models/token');

module.exports = () => passport.use(new githubStrategy({
    clientID: process.env.GIT_CLIENT_ID,
    clientSecret: process.env.GIT_SECRET,
    callbackURL: process.env.GIT_CALLBACK,
}, async (accessToken, refreshToken, profile, done) => {
    try{
        //console.log(profile);
        //{user_name, user_id}
        const {login, id} = profile._json;
        const login_as = 'github';
        const ex_user = await User.findOne({
            where: {kakao_id: id, login_as}
        });
        const date = new Date();
        let user, user_id;
        if(ex_user){
            await User.update(
                {
                    name: login,
                    password: `${id}`,
                    email: `${date.getMilliseconds()}`
                },
                {where: {kakao_id: id, login_as}}
            )
            user = ex_user;
            user_id = ex_user.id;
        }
        else{
            const new_user = await User.create({
                name: login,
                password: `${id}`,
                email: `${date.getMilliseconds()}`,
                login_as,
                kakao_id: `${id}`,
            });
            user = new_user;
            user_id = new_user.id;
        }
        await Token.create({
            user: user_id,
            git_oauth: accessToken,
            git_refresh: refreshToken,
        });
        done(null, user);
    }
    catch(err){
        console.error(err);
        next(err);
    }
}));