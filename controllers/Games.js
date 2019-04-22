/* eslint-disable import/order */
const shuffle = require('shuffle-array');
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const db = require('../config/db');

const options = {
	apiKey: 'cc331b34eeafcd404d605a2500b770401cc3b4c4a534b99aca563d9052348552', // use your sandbox app API key for development in the test environment
	username: 'audioads', // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(options);

const getUsers = (req, res) => {
	// console.log(req.params);
};

const runQuery = async (query, values) => {
	try {
		const queryResult = await db.query(query, values);
		return queryResult;
	} catch (error) {
		return false;
	}
};

const getStarted = async (req, res) => {
	const {
		id,
		email,
	} = req.params;
	const queryString = 'SELECT question, images, answer FROM questions WHERE question = $1';
	const {
		rows,
	} = await runQuery(queryString, [id]);

	const result = rows[0];
	result.answer = shuffle(result.answer.split(''));
	result.answer = shuffle(result.answer);

	// await runQuery('UPDATE users SET total = total + 1 WHERE email = $1 returning email', [email]);
	return res.status(200).json({
		status: true,
		msg: 'Get started!',
		question: rows[0],
	});
};

const checkAnswer = async (req, res) => {
	const {
		answer,
		currenttime,
	} = req.body;
	const {
		question,
		user,
	} = req.params;
	let queryString = 'SELECT answer FROM questions WHERE question = $1';
	const {
		rows,
	} = await runQuery(queryString, [question]);
	const result = rows[0].answer;
	// if (!hosts.includes(host)) return res.status(403).send('UNAUTH0RIZED');
	if (result.toLowerCase() !== answer.toLowerCase()) return res.status(200).send('WRONG');
	queryString = 'UPDATE users SET score = score + 1, currenttime = $1, total = total + 1 WHERE name = $2 returning score, total';
	// queryString = 'UPDATE users SET score = score + 1, currenttime = $1, total = total + 1, "timestamp" = CURRENT_TIMESTAMP WHERE name = $2 returning score, total';
	try {
		await runQuery(queryString, [currenttime, user]);
		return res.status(202).send('CORRECT');
	} catch (error) {
		console.log(error);
		return error;
	}
};

const storeTimer = async (req, res) => {
	const {
		currenttime,
	} = req.body;
	const {
		user,
	} = req.params;
	const host = req.headers.host;
	const hosts = ['http://staysharp.ng', 'https://stay-sharp.herokuapp.com'];
	let queryString = 'UPDATE users SET currenttime = $1, WHERE name = $2 returning score';
	// const queryString = 'UPDATE users SET currenttime = $1, "timestamp" = CURRENT_TIMESTAMP WHERE name = $2 returning score';
	if (!hosts.includes(host)) queryString = 'UPDATE users SET score = 0, currenttime = $1, total = 0 WHERE name = $2 returning score, total';
	try {
		const score = await runQuery(queryString, [currenttime, user]);
		return res.status(202).send('STORED');
	} catch (error) {
		return error;
	}
};

const checkRows = () => {
	const query = 'SELECT COUNT(*) FROM topmint';
	
};

const topmint = async (req, res) => {
	const {
		phone,
		time,
	} = req.body;
	const number = phoneUtil.parseAndKeepRawInput(phone, 'NG');
	if (!phoneUtil.isValidNumber(number)) return res.status(400).send('Phone number is invalid!');
	if (!phoneUtil.isValidNumberForRegion(number, 'NG')) return res.status(403).send('This service is valid for Nigerian residents only!');
	let queryString = 'SELECT phonenumber FROM topmint WHERE phonenumber = $1';
	const formatted = phoneUtil.format(number, PNF.E164);
	const {
		rows,
	} = await runQuery(queryString, [formatted]);
	if (rows.length > 0) return res.status(419).send('EXISTS');
	queryString = 'INSERT INTO topmint (phonenumber, timespent) VALUES($1, $2) returning phonenumber';
	await runQuery(queryString, [formatted, time]);
	const resultSearch = await runQuery('SELECT COUNT(*) FROM topmint');
	if (resultSearch.rows[0].count <= 100) {
		try {
			const Airtime = AfricasTalking.AIRTIME;
			const recipients = [{
				phoneNumber: formatted,
				amount: 1000,
				currencyCode: 'NGN',
			}];
			const result = await Airtime.send({
				recipients,
			});
			console.log(result);
			return res.status(200).send('SAVED');
		} catch (error) {
			return error;
		}
	} else return res.status(200).send('SAVED');
};

module.exports = {
	getStarted,
	runQuery,
	getUsers,
	checkAnswer,
	storeTimer,
	topmint,
};
