'use strict';

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var report = require('@alexistessier/report');

var _ = require('lodash');

module.exports = function saveFile(params){
	var $params = _.isObject(params) ? params : {};

	if(!_.isString($params.path)){throw new Error('SaveFile : Missing parameter path')};
	if(!_.isString($params.content)){throw new Error('SaveFile : Missing parameter content')};
	
	var reportMessageTransform = _.isFunction($params.reportMessageTransform) ? $params.reportMessageTransform : function (message) {
		return message;
	};

	var successCallback = _.isFunction($params.successCallback) ? $params.successCallback : null;
	var errorCallback = _.isFunction($params.errorCallback) ? $params.errorCallback : null;

	var outputPath = $params.path;

	mkdirp(path.dirname(outputPath), function (err) {
		if (err){
			report('error', reportMessageTransform(err.message));
			if( errorCallback ){ errorCallback(err); } else{ throw err; }
		}
    	else {
    		fs.writeFile(outputPath, $params.content, ($params.options || {encoding: 'utf8'}), function (err) {
				if (err){
					report('error', reportMessageTransform(err.message));
					if( errorCallback ){ errorCallback(err); } else{ throw err; }
				}
				else{
					report('notice', reportMessageTransform('File save at path: '+outputPath));
					successCallback ? successCallback($params) : null;
				}
			});	
    	}
	});
}