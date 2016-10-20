var http = require('http'),
    url = require('url');
    
module.exports = (function(){

    return function(callback, port){
        var server = http.createServer();

        server.on('request', function(request, response) {
            var body = [];
            request.on('data', function(chunk) {
                body.push(chunk);
            }).on('end', function() {
                body = Buffer.concat(body).toString();
                response.end('');
                var stuff = url.parse('http://localhost/?' + body.trim(), true).query;
                callback({
                    'sid' : stuff.SmsSid,
                    'from' : stuff.From,
                    'data' : stuff.Body
                });
            });
        });


        server.listen(port, function(){ console.log('listening'); });
    };

})();
