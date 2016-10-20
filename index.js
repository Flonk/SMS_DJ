var config = require('./config.json'),
    youtube = youtubeplaylist = require('./youtube.js')(config.youtube.api_key),
    sms = require('./twiliostream.js');


sms(function(message){

	youtube.search(message.body.trim()).then(function(data){
		console.log(message, data);
	});

}, config.twilio.webhook.port);