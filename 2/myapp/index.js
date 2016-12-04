import express from 'express';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cookieParser());
app.use(express.static('public'));
//app.METHOD(PATH, HANDLER)

app.use(function BasicLogger (req, res, next) {
	console.log('logging...');
	next();
});

app.use(function TimeLogger (req, res, next) {
	req.requestTime = Date.now();
	console.log('Request time: ' + Date.now());
	next();
});

app.get('/', function GetHome (req, res) {
	res.send('Hello World! Requested at: ' + req.requestTime);
});

app.post('/', function PostHome (req, res) {
	res.send('Hello you posted me');
});

app.use(function ErrorHandler (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send('Something broke!');
})

app.listen(3000, function ApplicationStart () {
	console.log('Example app listening on port 3000!');
});