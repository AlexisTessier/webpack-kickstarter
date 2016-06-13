import "babel-polyfill";

require('./generic');

require('./assets');

/*-----------------*/

require('./tools/modernizr');

let fastClick = require('fastclick');

import dom from '@alexistessier/dom';
import factory from 'tools/factory';
import responsiveImage from 'tools/responsive-image';
import SizeClassHelper from 'tools/size-class-helper';

/*-----------------*/

window.app = {
	factory,
	ui: {},
	sizeClassHelper: new SizeClassHelper(),
	modernizr: window.Modernizr
};

/*----------------*/

require('component/AppHeader');

import MyAccountMenu from 'component/MyAccountMenu';

/*----------------*/

dom.ready(() => {
	setDependencies();

	new fastClick(document.body);

	app.sizeClassHelper.init();

	responsiveImage.setup();

	app.root = dom.selectOne('#root');
	app.state = JSON.parse(dom.getData(app.root, 'state'));

	app.ui.accountMenu = factory.component.setupOne(MyAccountMenu);

	asyncSetup();
});

function setDependencies() {
	app.factory.dependencies.sizeClassHelper = app.sizeClassHelper;
}

function asyncSetup() {
	if(dom.selectOne('.Home_page_content')){
		require.ensure([], function (require) {
			require('component/Home');

			app.ui.homeCarousel = factory.component.setupOne(
				require('component/FullScreenCarousel').default
			);

			require('component/Happening/full_screen_carrousel_element');
			require('component/Event/full_screen_carrousel_element');

			app.sizeClassHelper.emitResize();
		});
	}

	if(dom.selectOne('.EventList_page_block')){
		require.ensure([], function (require) {
			require('component/EventList/page_block');
		});
	}
}