import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {appAware} from 'abstract/appAware'

import { connect } from 'react-redux'

import Book_product_list_element from 'component/Book_product_list_element'

export default connect(
	function props(state) {
		return {
			products: state.products
		};
	},
	function action(dispatch) {
		return {
			loadProductList: () => {
				dispatch({
					type: 'LOAD_PRODUCT_LIST',
					dispatch
				});
			}
		}
	}
)(appAware(class ProductList extends Component{
	constructor(props) {
		super(...arguments);
	}

	componentDidMount(){
		this.props.loadProductList();
	}

	render(){
		return require('./ProductList.react.jade')(
			Object.assign({
				Book_product_list_element
			}, this.props, this.state)
		);
	}
}))
