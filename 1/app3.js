const http = require('http')
const myaddon = require('./build/Release/addon')

let server = http.createServer(function Worker(req, res) {
	res.write('3 + 2 : ' + myaddon.add(3, 2, function AfterAdd(val) {
		console.log('calculated 3 plus 2 : ' + val);
	}));
	res.write('\n');
	res.write(myaddon.hello());
	res.end();
}).listen(8080, function OnListeningStart() {
	console.log('Start')
})