var config = require('./config.json'),
    youtube = youtubeplaylist = require('./youtube.js')(config.youtube.api_key),
    sms = require('./twiliostream.js'),
    fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io');


// Sends index.html to anyone visiting
var httpserver = http.createServer(function(req, res) {

	if(req.url === '/'){
		res.writeHead(200, {'Content-Type': 'text/html'});
    	res.end(fs.readFileSync(__dirname + '/index.html'));	
	}

	if(req.url === '/favicon.ico' || req.url === '/logo.png'){
		res.writeHead(200, {'Content-Type': 'image/png'});
    	res.end(fs.readFileSync(__dirname + '/logo.png'));
	}
    
});

var io = socketio.listen(httpserver);
httpserver.listen(config.websocket.port, function(){
	console.log('Websocket server listening on', config.websocket.port);
});

// Sends the default playlist to anyone listening
io.on('connection', function(socket) {
	console.log('New connection');
	youtube.playlist(config.youtube.defaultPlaylist).then(function(data){
		socket.emit('playlist', { 'data' : data });
	});
});


// Sends song requests to anyone listening
sms(function(message){
	var msg = message.data.trim().split('\n'),
	    song = msg[0],
	    rest = msg.slice(1).join(' ');

	console.log('New message', message);

	youtube.search(message.data.trim()).then(function(data){
		io.emit('request', {
			'from' : message.from,
			'message' : rest,
			'name' : data.name,
			'thumb' : data.thumb,
			'id' : data.id
		});
		console.log('Youtube response', data);
	});
}, config.twilio.webhook.port);
