import "babel-polyfill"

require('generic');

require('assets');

require('tools/modernizr');

import React from 'react'
import ReactDOM from 'react-dom'
import App from 'component/App'

import SizeClassHelper from 'tools/size-class-helper'
import { browserHistory } from 'react-router'
import routes from 'settings/routes'
import rootRoute from 'settings/routes/root'

import {pageStackTransition} from 'tools/page-transition/index'

window.api = require('tools/api').default;

window.sizeClassHelper = new SizeClassHelper();

window.app = ReactDOM.render(<App
	title="MyApp"
	description="Webpack kickstarter react..."
	fastclick={true}
	sizeClassHelper={window.sizeClassHelper}
	rootRoute={rootRoute}
	routes={routes}
	history={browserHistory}
	transition={{
		'default': {
			name: 'no'
		},
		'from-index-to-basket': pageStackTransition,
		'from-products-to-basket': pageStackTransition,
		'from-basket-to-index': pageStackTransition,
		'from-basket-to-products': pageStackTransition
	}}
/>, document.getElementById('root'));