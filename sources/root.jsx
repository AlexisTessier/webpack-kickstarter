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

window.app = ReactDOM.render(<App
	title="MyApp"
	description="Webpack kickstarter react..."
	fastclick={true}
	sizeClassHelper={new SizeClassHelper()}
	rootRoute={rootRoute}
	routes={routes}
	history={browserHistory}
	transition={{
		'default': {
			name: 'no'
		}
	}}
/>, document.getElementById('root'));