import agent from 'superagent'
import bowser from 'bowser'

let request = require('superagent');

let needCorsProxy = (bowser.msie && bowser.version <= 9);
let corsProxy = null;

function requestUseAndAction(req, action){
	function done(){
		req = req.use(corsProxy);
		action(req);
	}

	if (needCorsProxy) {
		if(corsProxy){
			done();
		}
		else{
			require.ensure([], function(require){
				corsProxy = require('superagent-d2l-cors-proxy');
				done();
			});
		}
	}
	else{
		action(req);
	}
}

let appRequest = {
	get: function (url, callback) {
		requestUseAndAction(request.get(url), action=>{
			action.end(callback);
		});
	},
	post: function (url, data, callback) {
		requestUseAndAction(request.post(url), action=>{
			action.type('form').send(data).end(callback);
		});
	}
}

export default appRequest;