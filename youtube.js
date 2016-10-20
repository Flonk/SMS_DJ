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
		}),
		'search'  : xhr('get', 'https://www.googleapis.com/youtube/v3/search', {}, {
			'part' : 'snippet',
			'maxResults'  : '1',
			'q' : '{query}',
			'key' : '{key}',
			'videoEmbeddable' : 'true',
			'type' : 'video'
		}),
	};

	function json(method, data){
		return method(data).then(function(response){
			return JSON.parse(response);
		});
	}

	function readplaylist(method, request, stuffs){
		if(!stuffs) stuffs = [];
		return json(method, request).then(function(data){
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
				return readplaylist(requests.playlist_next, {
					'id' : request.id,
					'key' : request.key,
					'next' : data.nextPageToken
				}, stuffs);
			}else{
				return stuffs;
			}
		});
	};

	function search(token, q){
		return json(requests.search, {
			'query' : q,
			'key' : token
		}).then(function(data){
			if(data.items.length > 0){
				var snippet = data.items[0].snippet,
				    url = snippet.thumbnails['default'].url,
				    p = url.split('/');

				return {
					'name' : snippet.title,
					'thumb' : url,
					'id' : p[p.length-2]
				}
			}else{
				throw 'not found';
			}
		})
	};

	return function(token){
		return {
			'playlist' : function(playlistid){
				return readplaylist(requests.playlist, {
					'id' : playlistid,
					'key' : token
				});
			},

			'search' : function(q){
				return search(token, q);
			}
		};
	};

})();