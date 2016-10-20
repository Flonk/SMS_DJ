var xhr = require('./xhr.js');

module.exports = (function(){

	var requests = {
		'playlist' : xhr('get', 'https://www.googleapis.com/youtube/v3/playlistItems', {}, {
			'part' : 'snippet',
			'maxResults'  : '50',
			'playlistId' : '{id}',
			'key' : '{key}'
		}),
		'playlist_next'  : xhr('get', 'https://www.googleapis.com/youtube/v3/playlistItems', {}, {
			'part' : 'snippet',
			'maxResults'  : '50',
			'playlistId' : '{id}',
			'key' : '{key}',
			'pageToken' : '{next}'
		})
	};

	function read(method, request, stuffs){
		if(!stuffs) stuffs = [];
		return method(request).then(function(response){
			return JSON.parse(response);
		}).then(function(data){
			data.items.forEach(function(item){
				if(
					item.snippet.title === 'Deleted video'
				 || item.snippet.title === 'Private video') return;				
				stuffs.push({
					'name' : item.snippet.title,
					'thumb' : item.snippet.thumbnails['default'].url,
					'id' : item.snippet.resourceId.videoId
				});
			});
			if(data.nextPageToken){
				return read(requests.playlist_next, {
					'id' : request.id,
					'key' : request.key,
					'next' : data.nextPageToken
				}, stuffs);
			}else{
				return stuffs;
			}
		});
	};

	return function(token, playlistid){
		return read(requests.playlist, {
			'id' : playlistid,
			'key' : token
		});
	};

})();