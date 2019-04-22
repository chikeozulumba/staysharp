/* eslint-disable quotes */
const Validator = require('validatorjs');
const db = require('../config/db');

const stringValidation = 'regex:/^([a-zA-Z0-9,.!? @_-]+)$/';
const nameValidation = 'regex:/^[A-Za-z]|[A-Za-z][A-Za-z]*[A-Za-z]$/';
const phoneValidation = 'regex:/^[a-zA-Z0-9-().s+]{10,15}$/';

const runQuery = async (query, values) => {
	try {
		const queryResult = await db.query(query, values);
		return queryResult;
	} catch (error) {
		return false;
	}
};

const getUsers = async (req, res) => {
	const { user } = req.params;
	const queryString = 'SELECT email, score, name, currenttime, finished FROM users WHERE name = $1 ';
	const { rows } = await runQuery(queryString, [user]);
	return res.status(200).json({ user: rows[0] });
};

const saveUsers = async (req, res) => {
	const {
		email, phone, name, ipaddress, city, country,
	} = req.body;
	const schema = {
		name: ['required', nameValidation, 'string', 'min:3', 'max:255'],
		phone: ['required', phoneValidation],
		email: 'required|email',
	};
	const validator = new Validator(req.body, schema);
	const errors = validator.errors.all();
	if (validator.fails()) return res.status(400).json({ status: false, msg: errors });
	let queryString = 'SELECT * FROM users WHERE name = $1';
	const { rows } = await runQuery(queryString, [name]);
	if (rows.length > 0) return res.status(419).json({ status: false, msg: 'Username already in use.' });
	queryString = 'INSERT INTO users(email, phone, name, ipaddress, confirmed, city, country, currenttime) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning email, score, name, finished, currenttime';
	const saveUser = await runQuery(queryString, [email, phone, name, ipaddress, true, city, country, 7200]);
	if (!saveUser) return res.status(500).json({ status: false, msg: 'An internal server error occured, please try again.' });
	return res.status(201).json({ status: true, msg: 'You can play the game', user: saveUser.rows[0] });
};

const addScore = async (req, res) => {
	const {
		user,
	} = req.params;
	const host = req.headers.host;
	const hosts = ['http://staysharp.ng', 'https://stay-sharp.herokuapp.com'];
	let queryString = 'UPDATE users SET score = score + 1, total = total + 1, WHERE email = $1 returning total';
	// const queryString = 'UPDATE users SET score = score + 1, total = total + 1, "timestamp" = CURRENT_TIMESTAMP WHERE email = $1 returning total';
	if (!hosts.includes(host)) queryString = 'UPDATE users SET score = 0, currenttime = $1, total = 0 WHERE name = $2 returning score, total';
	const score = await runQuery(queryString, [user]);
	return res.status(200).json({ status: true, score: score.rows[0].score });
};

const resetScore = async (req, res) => {
	const {
		name,
	} = req.params;
	const queryString = 'UPDATE users SET score = 0, total = 0, WHERE name = $1 returning score, total';
	// const queryString = 'UPDATE users SET score = 0, total = 0, "timestamp" = CURRENT_TIMESTAMP WHERE name = $1 returning score, total';
	const score = await runQuery(queryString, [name]);
	return res.status(200).json({ status: true, score: score.rows[0].total });
};

const getScore = async (req, res) => {
	const {
		user,
	} = req.params;
	const queryString = 'SELECT score, total, finished from users WHERE name = $1';
	const score = await runQuery(queryString, [user]);
	return res.status(200).json({
		status: true, score: score.rows[0].score, total: score.rows[0].total, finished: score.rows[0].finished,
	});
};

const leaders = async (req, res) => {
	const {
		user,
	} = req.params;
	// const queryString = 'SELECT DISTINCT ("timestamp"::date) "timestamp", name, total FROM users WHERE total > 0 ORDER BY total desc, name DESC LIMIT 20;';
	const queryString = `SELECT name, "timestamp", total FROM users ORDER BY total DESC LIMIT 20;`;
	// const queryString = `SELECT DISTINCT name, "timestamp", total FROM users WHERE total > 0 AND "timestamp" >= now()::date - interval '24h' ORDER BY total DESC LIMIT 20;`; // Implement this
	// const queryString = 'select * from ( select distinct on (name) * from users order by total, id desc ) t order by total desc';
	const { rows } = await runQuery(queryString);
	return res.status(200).json({
		rows,
	});
};

module.exports = {
	saveUsers, runQuery, getUsers, addScore, getScore, leaders, resetScore,
};
