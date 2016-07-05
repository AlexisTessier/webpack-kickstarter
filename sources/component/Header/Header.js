import React from 'react'

export default class Header extends React.Component{
	constructor(props) {
		super(...arguments);
		
	    this.state = {};

	    console.log(this.props);
	}

	render(){
		return require('./Header.react.jade')({
			Header: Object.assign({}, this.props, this.state)
		});
	}
}
