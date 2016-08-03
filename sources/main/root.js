import "babel-polyfill"

require('generic');

require('assets');

require('tools/modernizr');

import dom from '@alexistessier/dom'
import SizeClassHelper from 'tools/size-class-helper';

import App from 'component/App'

window.component = function component(_class) {
	return new _class().inject().init();
}

window.appContainer = {
	root: document.getElementById('root'),
	api: require('tools/api').default,
	sizeClassHelper: new SizeClassHelper(),
	env: window.ENV,
	cacheData: {
		booking: {}
	},
	app: component(App)
};

appContainer.main = function () {
	/*-----------------*/

	let mobileBreakPoint = 1100;
	let largeBreakPoint = 1450;

	appContainer.sizeClassHelper.setSizeClass('width-compact', {
		maxWidth: mobileBreakPoint
	});
	appContainer.sizeClassHelper.setSizeClass('width-regular', {
		minWidth:(mobileBreakPoint + 1),
		maxWidth: largeBreakPoint
	});
	
	appContainer.sizeClassHelper.setSizeClass('width-large', {
		minWidth: (largeBreakPoint + 1)
	});

	appContainer.sizeClassHelper.setSizeClass('width-ultra-compact', {
		maxWidth: 322
	});

	appContainer.sizeClassHelper.setSizeClass('header-logo-3-j-fluid', {
		minWidth:(mobileBreakPoint + 1),
		maxWidth: 1200
	});

	appContainer.sizeClassHelper.setSizeClass('product-listing-fluid-medium', {
		minWidth:850,
		maxWidth: 1100
	});

	appContainer.sizeClassHelper.setSizeClass('product-full-fluid-ultra-compact', {
		maxWidth: 500
	});

	appContainer.sizeClassHelper.setSizeClass('product-full-fluid-xx-compact', {
		maxWidth: 360
	});

	appContainer.sizeClassHelper.setSizeClass('booking-modal-form-fluid-compact', {
		maxWidth: 800
	});

	appContainer.sizeClassHelper.setSizeClass('booking-modal-form-fluid-ultra-compact', {
		maxWidth: 380
	});

	/*--------------*/

	appContainer.app.appendView(appContainer.root);
};

dom.ready(()=>{
	appContainer.main();
});