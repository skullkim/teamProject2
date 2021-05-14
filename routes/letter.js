const express = require('express');
const {isLoggedIn} = require('./middlewares');
const Posting = require('../models/postings');
const User = require('../models/users');
const Tag = require('../models/tags');
const PostTag = require('../models/post_tag');
const fs = require('fs');
const path = require('path');
const util = require('util');
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
        res.render('posting', {is_logged_int: req.isAuthenticated()});
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

        const id = posting.dataValues.author;
        const ex_user = await User.findOne({
            where: {id},
        });
        posting.dataValues.author = ex_user.name;
        const response = {
            "main_data": posting.dataValues,
            "tags" : tag_arr,
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

router.get('/result', (req, res, next) => {
    try{
        res.render('search-result', {isLoggedIn: req.isAuthenticated()});
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

router.get('/search-category', async(req, res, next) => {
    try{
        const {target} = req.query;
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
         res.send(null);
    }
    catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;