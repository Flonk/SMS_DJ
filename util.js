module.exports = {
	'format' : function(c, o){
		if(!o) return c;
		return c.replace(/\{([^\}]*)\}/g, function(x){
			return o[x.slice(1,-1).trim().toLowerCase()] || "";
		});
	},

	'date' : function(timestamp){
		var d = timestamp === undefined ? new Date() : new Date(timestamp),
			pad = function(x, n){ return util.pad(x.toString(), n || 2, '0'); };

		return pad(d.getDate()) + '.' + pad(d.getMonth()+1) + '.' + pad(d.getFullYear(), 4);
	},

	'pad' : function(what, length, padder){
		return (new Array(length+1).join(padder)).substring(0, length - what.length) + what;
	}
};