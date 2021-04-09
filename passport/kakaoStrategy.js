const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/users');
const Token = require('../models/token');
const AWS = require('aws-sdk');
const s3Stream = require('s3-streams');
const axios = require('axios');

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_CALLBACK,
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const {id, username} = profile;
            console.log('profile', profile);
            const login_as = 'kakao';
            //console.log(profile);
            const ex_user = await User.findOne({
                where: {login_as, api_id: id},
            });
            const path = profile._json.properties.profile_image;
            const key = `upload/profile/kakao/kakao-profile-${Date.now()}.jpg`;
            axios.get(path, {
                headers: {Authorization: `Bearer ${accessToken}`},
                responseType: 'stream',
            })
                .then(async (response) => {
                    const s3 = new AWS.S3();
                    response.data.pipe(s3Stream.WriteStream(s3, {
                        Bucket: `${process.env.AWS_S3_BUCKET}`,
                        Key: key,
                    }));
                })
                .catch((err) => {
                    console.error(err);
                });
            let user, user_id;
            if(ex_user){
                await User.update(
                    {
                        login_as,
                        name: `${username}`,
                        profile_key: `${key}`,
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
                    login_as,
                    api_id: `${id}`,
                    profile_key: `${key}`,
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