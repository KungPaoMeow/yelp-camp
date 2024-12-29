const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    let registeredUser;
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        registeredUser = await User.register(user, password);   // generates salt and hash field, saves to Mongo
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
        return;
    }

    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    });
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

// Passport looks for username and password fields from req.body and uses the defined local strategy to authenticate and login
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 


module.exports = router;