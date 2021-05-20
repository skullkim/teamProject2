const express = require('express');
const {isLoggedIn} = require('./middlewares');
const Posting = require('../models/postings');
const User = require('../models/users');
const Tag = require('../models/tags');
const Comment = require('../models/comments');
const PostingImages = require('../models/posting_images');
const {AwsConfig} = require('../routes/middlewares');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require("axios");
const {Op} = require("sequelize");

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
        res.render('posting', {is_logged_in: req.isAuthenticated()});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/letter-context', async (req, res, next) => {
    try{
        const written = req.query.written;
        const posting = await Posting.findOne({
            where: {id: written},
        });
        const tags = await posting.getTags();
        const tag_arr = new Array();
        tags.forEach((e) => {
            tag_arr.push(e.tag);
        });
        //console.log(tag_arr);
        const imgs = await PostingImages.findAll({
            attributes: ['id'],
            where: {post_id: posting.id},
        });
        console.log(imgs);
        // console.log(posting.id);
        const id = posting.dataValues.author;
        const ex_user = await User.findOne({
            where: {id},
        });
        posting.dataValues.author = ex_user.name;
        const response = {
            "main_data": posting.dataValues,
            "tags" : tag_arr,
            "posting_id" : posting.id,
            "images": imgs,
        };
        res.send(JSON.stringify(response));
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.post('/tags', async (req, res, next) => {
    try{
        const {category} = req.body;
        const readFile = util.promisify(fs.readFile);
        const tags = JSON.parse(await readFile(path.join(__dirname, '../public/tags.json'), 'utf8'));
        res.send({"tags": tags[category]});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/posting-images', async(req, res, next) => {
    try{
        const {post_id, img_id} = req.query;
        //console.log(post_id, img_id);
        const s3_key = await PostingImages.findOne({
            attributes: ['img_key'],
            where: {id: img_id}
        });
        //console.log("s3", s3_key.img_key);
        const s3 = new AWS.S3();
        s3.getObject({
            Bucket: `${process.env.AWS_S3_BUCKET}`,
            Key: `${s3_key.img_key}`,
        }, (err, data) => {
            if(err){
                console.error(err);
            }
            else{
                res.write(data.Body, 'binary');
                res.end(null, 'binary');
            }
        })
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/result', (req, res, next) => {
    try{
        res.render('search-result', {is_logged_in: req.isAuthenticated()});
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/categories', async(req, res, next) => {
    try{
        const readFile = util.promisify(fs.readFile);
        const categories = await readFile(path.join(__dirname, '../public/tags.json'), 'utf8');
        const res_data = JSON.parse(categories)
        res.send(res_data);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

router.get('/search-title', async(req, res, next) => {
    try{
        const {target} = req.query;
        const written = await Posting.findAll({
            where: {title: {[Op.like]: `%${target}%`}},
        });
        res.send(written);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

const findBook = async () => {
    const title = '프로그래밍';
    const result = await axios({
        method: 'GET',
        url: `https://dapi.kakao.com/v3/search/book?target=title`,
        headers: {Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`},
        params: {
            query: `${title}`,
        },
    });
    return result.data.documents;
}

router.get('/search-category', async(req, res, next) => {
    try{
        const {target} = req.query;
        if(target !== '도서 추천'){
            const written = await Posting.findAll({
                where: {main_category: {[Op.like]: `%${target}%`}},
            });
            if(written.length){
                console.log('posting' + written);
                return res.send(written);
            }
            const tag = await Tag.findOne({
                where: {tag: {[Op.like]: `%${target}%`}},
            });
            if(tag){
                const tag_result = await tag.getPostings();
                console.log('tag' + tag_result);
                return res.send(tag_result);
            }
        }
        else{
            return res.send(await findBook());
        }

        res.send(null);
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

router.get('/letter-comments', async(req, res, next) => {
    try{
        const {written} = req.query;
        const comments = await Comment.findAll({
            where: {posting_id: written}
        });
        res.send(comments);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;