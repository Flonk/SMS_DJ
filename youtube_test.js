var youtubeplaylist = require('./youtubeplaylist.js'),
    config = require('./config.json');

youtubeplaylist(config.youtube.api_key, 'PL1jtwaiNHlh7B6PwOwd2DP_ETacphsN5M').then(function(data){

	console.log(data);

});
