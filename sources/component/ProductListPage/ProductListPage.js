import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {appAware} from 'abstract/appAware'

import ProductList from 'component/ProductList'
//import BasketButton from 'component/BasketButton'

export default appAware(class ProductListPage extends Component{
	constructor(props) {
		super(...arguments);
		
	    this.state = {};
	}

	render(){
		return require('./ProductListPage.react.jade')(
			Object.assign({
				ProductList
			}, this.props, this.state)
		);
	}
})
