const express = require('express');
const path = require('path');
const Cookies = require('cookies');

const passport = require('../config/passport');

const router = express.Router();

const saveToken = (req, res, next) => {
	const cookies = new Cookies(req, res, {
		keys: ['stay-sharp'],
	});
	cookies.set('sessionId', req.params.token, {
		signed: true,
	});
	req.sessionId = req.params.token;
	next();
};

router.get('/facebook/:token', saveToken, passport.authenticate('facebook', {
	scope: ['email'],
}));
router.get('/callback/facebook', passport.authenticate('facebook', {
	successRedirect: '/auth/finish',
	failureRedirect: '/auth/finish',
}));
router.get('/finish', (req, res) => res.sendFile(path.resolve(__dirname, '../public', 'auth.html')));
router.get('/error', (req, res) => res.sendFile(path.resolve(__dirname, '../public', 'error.html')));

module.exports = router;
