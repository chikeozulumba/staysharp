/* eslint-disable consistent-return */
/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const slugify = require('slugify');
const Pusher = require('pusher');
const Cookies = require('cookies');

const FacebookStrategy = require('passport-facebook').Strategy;

const pusher = new Pusher({
	appId: '711533',
	key: '199c383bb3b1fedac642',
	secret: 'bb57d51c6b18920d99e7',
	cluster: 'eu',
	useTLS: true,
});

const db = require('./db');

const runQuery = async (query, values) => {
	try {
		const queryResult = await db.query(query, values);
		return queryResult;
	} catch (error) {
		return false;
	}
};

passport.use(new FacebookStrategy({
	passReqToCallback: true,
	clientID: process.env.FACEBOOK_ID,
	clientSecret: process.env.FACEBOOK_SECRET,
	callbackURL: process.env.FACEBOOK_REDIRECT,
	profileFields: ['id', 'displayName', 'picture.width(200).height(200)', 'first_name', 'middle_name', 'last_name', 'gender', 'link', 'email', 'location', 'friends'],
}, ((req, accessToken, refreshToken, profile, done) => {
	const sessionId = req.cookies.sessionId;
	const data = profile._json;
	// FIND USER FIRST
	const name = slugify(data.name.toLowerCase(), '_');
	let queryString = 'SELECT * FROM users where name = $1';
	runQuery(queryString, [name]).then((res) => {
		if (res.rows.length === 0) {
			queryString = 'INSERT INTO users(email, name, confirmed, currenttime) VALUES($1, $2, $3, $4) returning email, score, name, finished, currenttime';
			runQuery(queryString, [data.email, name, true, 7200]).then(resData => pusher.trigger('auth', sessionId, resData.rows[0]));
		} else pusher.trigger('auth', sessionId, res.rows[0]);
		done();
	});
})));

module.exports = passport;