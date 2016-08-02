import apiSettings from 'settings/api'

import API from 'tools/api/api';

import {
	isArray,
	forEach,
	camelCase
} from 'lodash'

let apiList = isArray(apiSettings) ? apiSettings : [apiSettings];

let _api = {};

forEach(apiList, api => {
	_api[camelCase(api.name)] = new API({
		host: api.host,
		routes: api.routes
	});
});

export default _api;