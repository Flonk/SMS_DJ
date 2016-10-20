var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    util = require('./util.js');

module.exports = function(method, url, headers, body){
	method = method.toUpperCase();
	return function(data){			
		return new Promise(function(resolve, reject){
			var r = new XMLHttpRequest(), sbody;

			if(typeof body === 'object'){
				sbody = Object.keys(body).map(function(key){
					return key+'=' + encodeURIComponent(util.format(body[key], data));
				}).join('&');
				if(method === 'POST') headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}else{
				sbody = body;
			}

			if(method === 'GET') r.open(method, url+'?'+sbody, true);
			else r.open(method, url+'?'+sbody, true);

			if(headers) Object.keys(headers).forEach(function(key){
				r.setRequestHeader(key, util.format(headers[key], data));
			});				

			r.onreadystatechange = function(){
				if(r.readyState == 4){
					if(r.status == 200) resolve(r.responseText);
					else reject(r);
				}
			}

			if(method === "GET") r.send("");
			else r.send(sbody);
		});
	}
};