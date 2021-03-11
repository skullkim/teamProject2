const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const {time} = require('console');
app.use(session({
    resave: false,
    saveUninitialized: false,
    proxy: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: time.getMilliseconds + (100000 * 60),
    },
    name: "session-cookie",
}));

// app.get('/', (req, res, next) => {
//     res.send('success');
// })
const index_router = require('./routes');

app.use(path.join(__dirname, '/style'), express.static('public'));
app.use(path.join(__dirname, '/script'), express.static('public'));
app.use('/', index_router);

app.use((req, res, next) => {
    const error = new Error(`${res.method} ${req.url} router doesn't exist`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.messgae;
    res.locals.error = process.env.NODE_DEV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.send(res.locals.message);
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')} server start`);
})