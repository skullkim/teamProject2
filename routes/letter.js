const express = require('express');
const {isLoggedIn} = require('./middlewares');
const Posting = require('../models/postings');
const User = require('../models/users');
const Tag = require('../models/tags');
const PostTag = require('../models/post_tag');
const fs = require('fs');
const path = require('path');
const util = require('util');

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
})

module.exports = router;