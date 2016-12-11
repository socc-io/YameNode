import net from 'net';
import readline from 'readline';

const reader = readline.createInterface({
	input:  process.stdin,
	output: process.stdout
});

let msgs = []

function makeConnection(connStatus) {
	const client = net.connect(connStatus, function () {
		console.log('\nConnect to ' + connStatus.host + ':' + connStatus.port);
		// this.setTimeout(5000);
		this.setEncoding('utf8')
		this.on('data', function (data) {
			msgs = [...msgs, data]
			readline.clearLine(process.stdout, 1);
			readline.cursorTo(process.stdout, 0, 1);
			for(const msgIdx in msgs) {
				console.log('msg from other: ' + msgs[msgIdx]);
			}
			readline.cursorTo(process.stdout, 10, 0);
		});
		this.on('end', function () {
			console.log('disconnected');
		});
		this.on('timeout', function () {
			console.log('connection timeout');
		});
		this.on('error', function (err) {
			console.log('err: ' + JSON.stringify(err));
		});
		this.on('close', function () {
			console.log('socket closed');
		})
	});
	return client;
}

function send(socket, data) {
	if(socket.write(data)) {
		(function(socket, data) {
			socket.once('drain', function () {
				send(socket, data);
			});
		})(socket, data);
	}
}

function run () {
	const conn = makeConnection({
		port: 1234,
		host: 'localhost'
	});
	(function getMsgAndSend () {
		readline.cursorTo(process.stdout, 0, 0);
		reader.question('your msg: ', function (ans) {
			send(conn, ans);
			getMsgAndSend();
		});
	})();
}
readline.clearScreenDown(process.stdout);
run();
