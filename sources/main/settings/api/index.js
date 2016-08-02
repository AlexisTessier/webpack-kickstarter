import {
	isArray
} from 'lodash'

export default {
	name: 'apiName',
	host:'http://api.host.fr',
	routes: {
		routeName: 'routePath',
		routeName:{
			url: 'routePathSegment/{routeParams}/routePathSegment',
			urlData: {
				routeParams: function(data) {
					return (isArray(data) ? data : [data]).join(',');
				}
			}
		}
	}
}