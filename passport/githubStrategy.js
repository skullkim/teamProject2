const passport = require('passport');
const githubStrategy = require('passport-github');
const User = require('../models/users');
const Token = require('../models/token');
const AWS = require('aws-sdk');
const s3Stream = require('s3-streams');
const axios = require('axios');

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
            where: {api_id: id, login_as}
        });
        const img_path = profile.photos[0].value;
        const profile_img = `github-profile-${Date.now()}.jpg`;
        const key = `upload/profile/github/github-profile-${Date.now()}`;
        axios.get(img_path, {
            responseType: 'stream',
        })
            .then((response) => {
                const s3 = new AWS.S3();
                response.data.pipe(s3Stream.WriteStream(s3, {
                    Bucket: `${process.env.AWS_S3_BUCKET}`,
                    Key: key,
                }));
            })
            .catch((err) => {
                console.error(err);
            });
        const date = new Date();
        let user, user_id;
        if(ex_user){
            await User.update(
                {
                    name: login,
                    password: `${id}`,
                    email: `${date.getMilliseconds()}`,
                    profile_key: key,
                },
                {where: {api_id: id, login_as}}
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
                api_id: `${id}`,
                profile_key: key,
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