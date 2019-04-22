const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');


const app = express();

app.use(logger('dev'));
// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

const handleCors = (req, res, next) => {
	const whitelist = ['www.staysharp.ng', 'stay-sharp.herokuapp.com', 'localhost:3000'];
	const host = req.headers.host;
	if (!whitelist.includes(host)) return res.status(403).send('UNAUTHORIZED');
	next();
};

app.use(cookieParser());
app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'www')));

app.use('/', express.static(path.join(__dirname, 'www')));
app.use('/start', express.static(path.join(__dirname, 'www')));
app.use('/unveil', express.static(path.join(__dirname, 'unveil')));
app.use('/unveil/finish', express.static(path.join(__dirname, 'unveil')));
app.use('/css', express.static(path.join(__dirname, 'unveil/css')));
app.use('/js', express.static(path.join(__dirname, 'unveil/js')));
app.use('/fonts', express.static(path.join(__dirname, 'unveil/fonts')));
app.use('/', express.static(path.join(__dirname, 'unveil/')));
app.use('/', handleCors, indexRouter);
app.use('/users', handleCors, usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	return res.send('error');
});

module.exports = app;