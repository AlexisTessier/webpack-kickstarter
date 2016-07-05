import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import App from 'component/App'

import SizeClassHelper from 'tools/size-class-helper'

window.app = ReactDOM.render(<App
	title="MyApp"
	description="Webpack kickstarter react..."
	fastclick={true}
	sizeClassHelper={new SizeClassHelper()}
/>, document.getElementById('root'));