import net from 'net';

let clients = [];

const server = net.createServer(function(client) {
	console.log('Client connection: ');
	console.log('local = %s:%s', client.localAddress,  client.localPort);
	console.log('remote= %s:%s', client.remoteAddress, client.remotePort);
	clients = [...clients, client];
	// client.setTimeout(5000);
	client.setEncoding('utf8');
	client.on('data', function(data) {
		for(const cidx in clients) {
			if(clients[cidx] !== client)
				clients[cidx].write(data)
		}
		console.log('msg: ' + data);
	});
	client.on('end', function () {
		console.log('disconnected');
		clients = clients.filter(function (obj) {
			return obj !== client;
		})
		server.getConnections(function (err, count) {
			console.log('remaining conn: ' + count);
		});
	});
	client.on('error', function (err) {
		console.log('socket err: ' + JSON.stringify(err));
	});
	client.on('timeout', function () {
		console.log('socket timeout');
	});
});

server.listen(1234, function () {
	console.log('Server listening: ' + JSON.stringify(server.address()));
	server.on('close', function () {
		console.log('Server terminated');
	});
	server.on('error', function (err) {
		console.log('server error: ' + JSON.stringify(err));
	});
});

function send(socket, data) {
	if(socket.write(data)) {
		(function(socket, data) {
			socket.once('drain', function () {
				send(socket, data);
			});
		})(socket, data);
	}
}