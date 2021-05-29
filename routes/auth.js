const express = require('express');
const AWS = require('aws-sdk');
const{isLoggedIn, isNotLoggedIn, AwsConfig, uploadProfileImage, uploadPostingImages} = require('./middlewares');
const User = require("../models/users");
const Posting = require('../models/postings');
const Tag = require('../models/tags');
const Comment = require('../models/comments');
const PostingImage = require('../models/posting_images');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/posting', isLoggedIn, (req, res, next) => {
    try{
        res.render('new-posting', {is_logged_in: true, message: req.flash('message')});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    try{
        const {name, login_as} = req.user.dataValues;
        const local_login = login_as ? false : true;
        res.render('profile', {is_logged_in: true, user_name: name, local_login});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/profile-img', isLoggedIn, (req, res, next) => {
    try{
        const s3 = new AWS.S3();
        const {profile_key} = req.user;
        const s3_key = profile_key ? profile_key : process.env.DEFAULT_PROFILE_IMG_KEY;
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${s3_key}`,
        }, (err, data) => {
            if(err){
                console.error(err);
            }
            else{
                res.write(data.Body, 'binary');
                res.end(null, 'binary');
            }
        });
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/edit-password', isLoggedIn, (req, res, next) => {
    try{
        res.render('edit-password', {is_logged_in: true});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/confirm-edit-password', isLoggedIn, async (req, res, next) => {
    try{
        const {prev_passwd, new_passwd, login_as} = req.body;
        const {id, password} = req.user;
        const result = await bcrypt.compare(prev_passwd, password);
        if(!result){
            res.send({err: 'incorrect previous password'});
            return;
        }
        const new_password = await bcrypt.hash(new_passwd, 12);
        await User.update(
            {password: new_password},
            {where: {id}},
        );
        res.end();
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/edit-profile', isLoggedIn, (req, res, next) => {
    try{
        res.render('edit-profile', {is_logged_in: true, message: req.flash('message')});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/user-info', isLoggedIn, (req, res, next) => {
    try{
        const {name, email, age} = req.user;
        res.send({name, email, age});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

const checkAge = (age) => {
    const reg_age = /^[0-9]*$/;
    return !reg_age.test(age) ? false : true;
}

router.post('/edit-user-info', isLoggedIn, uploadProfileImage.single('profile_img'), async (req, res, next) => {
    try{
        const {id, login_as, profile_key} = req.user;
        if(login_as){
            req.flash('message', 'you can only change profile when you login locally');
            res.redirect('/auth/edit-profile');
        }
        const {name, email, age} = req.body
        console.log("body", name, email, age);
        //이름 중복
        if(name){
            const ex_name = await User.findOne({
                where: {name},
            });
            if(ex_name){
                req.flash('message', 'Same name already exists');
                res.redirect('/auth/edit-profile');
            }
        }
        //email 중
        if(email){
            const ex_email = await User.findOne({
                where: {email},
            });
            if(ex_email){
                req.flash('message', 'Same email already exists');
                res.redirect('/auth/edit-profile');
            }
        }
        if(!checkAge(age)){
            req.flash('message', 'incorrect age');
            res.redirect('/auth/edit-profile');
        }
        if(req.file){
            const {location, key} = req.file;
            await User.update({
                profile_key: `${key}`,
            }, {where: {id}});
            const s3 = new AWS.S3();
            s3.deleteObject({
                Bucket: `${process.env.AWS_S3_BUCKET}`,
                Key: `${profile_key}`,
            }, (err, data) => {
                err ? console.error(err) : console.log('local profile image deleted');
            })

        }
        if(name){
            await User.update(
                {name},
                {where: {id}}
            );
        }
        if(email){
            await User.update(
                {email},
                {where: {id}}
            );
        }
        if(age){
            await User.update(
                {age},
                {where: {id}}
            );
        }
        res.redirect('/auth/profile')
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/new-posting', isLoggedIn, uploadPostingImages.array('imgs'), async (req, res, next) => {
    try{
        const {title, category, context, tags} = req.body;
        const {id} = req.user;
        console.log(req.files);
        const ex_posting =  await Posting.findOne({
            where: {title},
        });
        if(ex_posting){
            req.flash('message', 'same title exist');
            res.redirect('/auth/posting');
            //res.send({err: 'same title exist'});
        }
        else{
            const posting = await Posting.create({
                author: id,
                title,
                main_posting: `${context}`,
                main_category: `${category}`,
            });
            const images = req.files;
            //images.forEach((img) => console.log(e));
            await Promise.all(
                images.map((img) => {
                    PostingImage.create({
                        post_id: posting.id,
                        img_key: img.key,
                    })
                })
            );
            if(tags){
                if(typeof tags === "object"){
                    const result = await Promise.all(
                        tags.map((tag) => {
                            return Tag.create({
                                tag
                            });
                        })
                    );
                    await posting.addTags(result.map(r => r.id));
                }
                else{
                    const result = await Tag.create({
                        tag: tags,
                    });
                    await posting.addTags(result);
                }
            }
            res.redirect('/');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/postings', async (req, res, next) => {
    try{
        const postings = await Posting.findAll();
        res.send(postings);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/new-comment', isLoggedIn, async(req, res, next) => {
    try{
        const {comment, written} = req.body;
        const {id, name} = req.user;
        await Comment.create({
            commenter_id: id,
            commenter: name,
            posting_id: written,
            comment: comment,
        });
        res.send({name: req.user.name});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/wrote-postings', isLoggedIn, async(req, res, next) => {
    try{
        const {id} = req.user;
        const postings = await Posting.findAll({
            where: {author: id},
        });
        res.send(postings);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/wrote-comments', isLoggedIn, async(req, res, next) => {
    try{
        const {id} = req.user;
        const posting = await Comment.findAll({
            where: {commenter_id: id},
        });
        res.send(posting);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/edit-posting', isLoggedIn, (req, res, next) => {
    try{
        res.render('edit-posting', {is_logged_in: true, message: req.flash('message')});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/confirm-edit-posting', isLoggedIn, uploadPostingImages.array('imgs'), async(req, res, next) => {
    try{
        const {post_id} = req.query;
        const {title, category, context, tags} = req.body;
        const {id} = req.user;
        const post_id_num = post_id * 1;
        const ex_posting =  await Posting.findOne({
            where: {title}
        });
        if(ex_posting && ex_posting.id !== post_id_num){
            //res.send({err: 'same title exist'});
            req.flash('message', 'same title exist');
            return res.redirect(`/auth/edit-posting?written=${post_id}`);
        }
        else{
            await Posting.update({
                title,
                main_posting: `${context}`,
                main_category: `${category}`,
            },{
                where: {id: post_id_num},
            });
            const posting = await Posting.findOne({
                where: {title}
            });
            const prev_tags = await posting.getTags();
            if(prev_tags && tags){
                await Promise.all(
                    prev_tags.map((tag) => {
                        posting.removeTag(tag.id);
                    })
                );
                const result = await Promise.all(
                    tags.map((tag) => {
                        return Tag.create({
                            tag
                        });
                    })
                );
                await posting.addTags(result.map(r => r.id));
            }
            const images = req.files;
            if(images){
                const prev_imgs = await PostingImage.findAll({
                    attributes: ['img_key'],
                    where: {post_id: post_id_num},
                });
                console.log(prev_imgs);
                const s3 = new AWS.S3();
                prev_imgs.map((img) => {
                    console.log(img.dataValues.img_key)
                    s3.deleteObject({
                        Bucket: `${process.env.AWS_S3_BUCKET}`,
                        Key: `${img.dataValues.img_key}`,
                    }, (err, data) => {
                        err ? console.error(err) : console.log('delete img success');
                    });
                });
                await PostingImage.destroy({
                    where: {post_id: post_id_num},
                });
                await Promise.all(
                    images.map((img) => {
                        PostingImage.create({
                            post_id: posting.id,
                            img_key: img.key,
                        })
                    })
                );

            }
            res.redirect('/auth/profile');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/remove-posting', isLoggedIn, async(req, res, next) => {
    try{
        const {written} = req.query;
        const posting = await Posting.findOne({
            where: {id: written},
        });
        const tags = await posting.getTags();
        await Promise.all(
            tags.map((tag) => {
                posting.removeTag(tag.id);
            })
        );
        await Posting.destroy({
            where: {id: written}
        });
        res.redirect('/auth/profile');
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.put('/comments-edit', isLoggedIn, async(req, res, next) => {
    try{
        const {new_comment} = req.body;
        const {id} = req.query;
        await Comment.update({
            comment: new_comment
        }, {
            where: {id}
        });
        res.send('success');
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.delete('/remove-comment', isLoggedIn, async(req, res, next) => {
    try{
        const {id} = req.query;
        await Comment.destroy({
            where: {id},
        });
        res.send('success');
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;