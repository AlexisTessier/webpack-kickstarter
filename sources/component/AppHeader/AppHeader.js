import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {appAware} from 'abstract/appAware'

export default appAware(class AppHeader extends Component{
	constructor(props) {
		super(...arguments);
		
	    this.state = {};
	}

	render(){
		return require('./AppHeader.react.jade')(
			Object.assign({}, this.props, this.state)
		);
	}
});
