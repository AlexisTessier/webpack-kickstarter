import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {appAware} from 'abstract/appAware'

export default appAware(class Book_product_list_element extends Component{
	constructor(props) {
		super(...arguments);
		
		console.log(this)

	    this.state = {};
	}

	render(){
		return require('./Book_product_list_element.react.jade')(
			Object.assign({}, this.props, this.state)
		);
	}
})
