const express = require('express');
const cors = require('cors');
const Game = require('../controllers/Games');

const router = express.Router();

const whitelist = ['www.staysharp.ng', 'stay-sharp.herokuapp.com', 'localhost:3000'];
const corsOptions = {
	origin(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback('UNAUTHORIZED', false);
		}
		callback(null, true);
	},
};

// router.options('*', cors(corsOptions));

/* GET home page. */
router.get('/start/:id/:email', Game.getStarted);
router.post('/check-answer/:question/:user', Game.checkAnswer);
router.post('/store-timer/:user', Game.storeTimer);
router.post('/topmint/', Game.topmint);

module.exports = router;
