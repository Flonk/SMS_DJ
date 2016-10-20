module.exports = (function(){

	function get_messages(client){
		return new Promise(function(resolve){
			client.messages.get().then(function(sms){
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
	};

	function messages_since(client, sid){
		return get_messages(client).then(function(sms){
			var found = false;
			return sms.filter(function(sms){
				if(found) return false;
				if(sms.sid === sid){
					found = true;
					return false;
				}
				return true;
			});
		});
	};

	function message_stream(callback, data){
		var client = require('twilio')(data.sid, data.auth_token);
		get_messages(client).then(function(sms){
			var newest = sms[0].sid;
			setInterval(function(){
				messages_since(client, newest).then(function(sms){
					if(sms.length > 0) newest = sms[0].sid;
					sms.reverse().forEach(function(sms){
						callback(sms);
					});
				})
			}, data.interval || 20000);
		})
	};

	return message_stream;

});
