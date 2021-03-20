const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
    try{
        //console.log(111);
        //res.sendFile(path.join(__dirname, '../views/index.html'));
        res.render('index');
    }
    catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;