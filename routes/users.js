const express = require('express');
const cors = require('cors');
const User = require('../controllers/Users');

const router = express.Router();

const whitelist = ['www.staysharp.ng', 'stay-sharp.herokuapp.com', 'localhost:3000'];
const corsOptions = {
	origin(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
			console.log(origin)
		} else {
			console.log(origin)
			callback('UNAUTHORIZED', false);
		}
		callback(null, true);
	},
};

// router.options('*', cors(corsOptions));

/* POST Create user account. */
router.get('/check/:user', User.getUsers);
router.get('/score/:user', User.addScore);
router.get('/score/:user/final', User.getScore);
router.post('/register', User.saveUsers);
router.get('/leaders', User.leaders);
router.get('/reset/:name', User.resetScore);

module.exports = router;
