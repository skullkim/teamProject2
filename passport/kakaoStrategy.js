const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/users');
const Token = require('../models/token');

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_CALLBACK,
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const {id, username} = profile;
            const login_as = 'kakao';
            //console.log(profile);
            const ex_user = await User.findOne({
                where: {login_as, api_id: id},
            });
            let user, user_id;
            if(ex_user){
                await User.update(
                    {
                        login_as,
                        name: `${username}`,
                    },
                    {where: {login_as, api_id: id}},
                );
                user = ex_user;
                user_id = ex_user.id;
            }
            else{
                const date = new Date();
                const new_user = await User.create({
                    name: username,
                    password: `${id}`,
                    email: `${date.getMilliseconds()}`,
                    api_id: `${id}`,
                });
                user = new_user;
                user_id = new_user.id;
            }
            await Token.create(
                {
                    user: user_id,
                    kakao_oauth: accessToken,
                    kaka_refresh: refreshToken,
                }
            );
            done(null, user);
        }
        catch(err){
            console.error(err);
            next(err);
        }
    }));
}