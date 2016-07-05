import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {appAware} from 'component/App';

export default appAware(class ProductList extends Component{
	constructor(props) {
		super(...arguments);
		
	    this.state = {};
	}

	render(){
		return require('./ProductList.react.jade')(
			Object.assign({}, this.props, this.state)
		);
	}
})
