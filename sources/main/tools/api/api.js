import request from 'tools/api/request'

import {
	forEach,
	isObject,
	isString,
	isFunction,
	camelCase,
	has
} from 'lodash'

function applyUrlData(routePattern, transform, urlVar){
	forEach(transform, (tr, name)=>{
		if(has(urlVar, name)){
			let placeHolder = '{'+name+'}';
			while(routePattern.indexOf(placeHolder) >= 0){
				routePattern = routePattern.replace(placeHolder, (isFunction(transform) ? transform(urlVar[name]) : urlVar[name]));
			}
		}
		else{
			throw new Error("No value provided for url variable "+name+" ("+routePattern+")");
		}
	});

	return routePattern;
}

export default class Api {
	constructor({
		host,
		routes
	}) {
		let getRoutes = {};
		let postRoutes = {};

		forEach(routes, (route, name)=>{
			let routeIsString = isString(route);
			let routeUrl = routeIsString ? route : route.url;
			let urlData = (!routeIsString && isObject(route.urlData)) ? route.urlData : {};

			let method = routeIsString ? 'get' : (route.method === 'post' ? 'post' : 'get');

			if(method === 'get'){
				getRoutes[camelCase(name)] = (urlVar = {}, _resolve, _reject = null) => {
					let resolve = isFunction(urlVar) ? urlVar : _resolve;
					let reject = isFunction(urlVar) ? _resolve : _reject;
					let url = applyUrlData(routeUrl, urlData, urlVar);

					if(isFunction(resolve)){
						this._get(url, resolve, reject);
					}
					else{
						return new Promise((resolve, reject) => {
							this._get(url, resolve, reject);
						});
					}
				}
			}
			else if(method === 'post'){
				postRoutes[camelCase(name)] = (data = {}, resolve, reject = null) => {
					let url = applyUrlData(routeUrl, data, urlVar);

					if(isFunction(resolve)){
						this._post(url, data, resolve, reject);
					}
					else{
						return new Promise((resolve, reject) => {
							this._post(url, data, resolve, reject);
						});
					}
				}
			}
		});

		let get = Object.assign((url, callback) => {
			return this._get(url, callback);
		}, getRoutes);

		let post = Object.assign((url, data, callback) => {
			return this._post(url, data, callback);
		}, postRoutes);

		while(host.lastIndexOf('/') === (host.length-1)){
			host = host.substring(0, (host.length-1));
		}

		Object.assign(this, {
			host, routes, get, post
		})
	}

	getUrl(route){
		while(route.indexOf('//') >= 0){
			route=route.replace('//', '/');
		}

		while(route.indexOf('/') === 0){
			route=route.replace('/', '');
		}

		return this.host+'/'+route;
	}

	_get(route, resolve, reject = null) {
		request.get(this.getUrl(route), responseHandler(resolve, reject));
	}

	_post(route, data, resolve, reject = null) {
		request.post(this.getUrl(route), data, responseHandler(resolve, reject));
	}
}

function responseHandler(resolve, reject){
	return function (error, response) {
		if(error){
			console.log(error.message);
			if(isFunction(reject)){
				reject(error, response);
			}
			return;
		}
		if(response.status !== 200){
			let err = new Error(error ? error : 'REQUEST BAD STATUS');
			console.log(err.message);
			if(isFunction(reject)){
				reject(err, response);
			}
			return;
		}
		if (isFunction(resolve)) {
			resolve(response.body, response);
		}
	}
}