import "babel-polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import App from 'component/App'

ReactDOM.render(<App
	title="MyApp"
	description="Webpack kickstarter react..."
	fastclick="true"
/>, document.getElementById('root'));