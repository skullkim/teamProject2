const path = require('path');

exports.isLoggedIn = (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/?error=you have to login first');
}

exports.isNotLoggedIn = (req, res, next) => {
    !req.isAuthenticated() ? next() : res.redirect('/?error=you already logged in');
}