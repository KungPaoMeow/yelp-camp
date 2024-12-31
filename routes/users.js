const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    // Passport looks for username and password fields from req.body and uses the defined local strategy to authenticate and login
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout); 

module.exports = router;