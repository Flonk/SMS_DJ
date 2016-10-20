var config = require('./config.json'),
    client = require('twilio')(config.twilio.sid, config.twilio.auth_token),
    start = (+new Date()),
    day = require('moment')().format('YYYY-MM-DD');

console.log(day);


function messages(){
	return new Promise(function(resolve){
		client.messages.get({'DateSent' : '>='+day}).then(function(sms){
			resolve(
				sms.messages
				   .filter(function(message){ return message.direction === 'inbound'; })
				   .map(function(sms){ return {
				       'sid' : sms.sid,
				       'from' : sms.from,
				       'text' : sms.body,
				       'time' : +sms.dateSent
				   };})
			);
		});
	});
}

messages().then(function(d){ console.log(d); });