const http = require('http');

let datBuffer = [];

let server = http.createServer(function Worker(req, res) {
	console.log('Worker started - got a request');
});

server.on('request', function Proc1(req, res) {
	console.log('proc1 started');
});

server.on('request', function Proc2(req, res) {
	console.log('proc2 started');
});

server.on('request', function HeaderPrinter(req, res) {
	console.log('method:     ' + req.method)
	console.log('url:        ' + req.url)
	const headers = req.headers;
	console.log('user-agent: ' + headers['user-agent'])
	req.mymethod = req.method + ':hehe:' + req.url;
})

server.on('request', function Processor(req, res) {
	req.on('error', function RequestErrorHandler(err) {
		console.log('Err: ' + err);
	}).on('data', function OnData(chunk) {
		console.log("Got chunk: " + chunk);
		datBuffer.push(chunk);
	}).on('end', function OnDataEnd() {
		datBuffer = Buffer.concat(datBuffer).toString();

		res.on('error', function ResponseErrorHandler(err) {
			console.log('res err: ' + err);
		});

		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');

		let resBody = {
			headers: req.headers,
			method: req.method,
			url: req.url,
			body: datBuffer,
		}

		res.write(JSON.stringify(resBody));
		res.end();

		console.log('body: ' + datBuffer);
		datBuffer = [];
	});
});

server.listen(8080, function OnStart() {
	console.log('Server Started!')
});