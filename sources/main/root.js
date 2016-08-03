import "babel-polyfill"

require('generic');

require('assets');

require('tools/modernizr');

import SizeClassHelper from 'tools/size-class-helper';

window.app = {
	root: document.getElementById('root'),
	api: require('tools/api').default,
	sizeClassHelper: new SizeClassHelper()
};

console.log(app);