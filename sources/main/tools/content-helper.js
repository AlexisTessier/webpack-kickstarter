import {chain, isArray} from 'lodash'

let contentHelper = {};

export function p(pList) {
	return isArray(pList) ? (_.chain(pList).map(p=>{
		return contentHelperP(p);
	}).commit().value().join('')) : '<p>'+pList+'</p>';
}

contentHelper.p = p;

export default contentHelper;