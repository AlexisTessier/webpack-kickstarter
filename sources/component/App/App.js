import React from 'react'
import ReactDOM from 'react-dom'

import Header from 'component/Header';

export default class App extends React.Component{
	constructor(props) {
		super(...arguments);

	    this.state = {
	    	mustActiveFastClick: this.props.fastclick === 'true'
	    }
	}

	static get defaultProps(){
		return {
			title: getTagTitleContent(),
			fastclick: "false",
			description: getMetaDescription()
		};
	}

	componentDidUpdate(prevProps){
		if(this.props.title !== prevProps.title){
			setTagTitleContent(this.props.title);
		}

		if(this.props.description !== prevProps.description){
			setMetaDescription(this.props.description);
		}
	}

	componentDidMount(){
		if(this.state.mustActiveFastClick){
			require.ensure([], function(require) {
				let fastClick = require('fastclick');
				new fastClick(document.body);
			});
		}

		this.componentDidUpdate({}, {});
	}

	render(){
		return require('./App.react.jade')({
			Header,
			App: Object.assign({}, this.props, this.state)
		});
	}
}

/*-------------------------*/

function getTagTitleContent(){
	let title = document.querySelector('title');
	
	return title ? title.innerHTML : 'App';
}

function setTagTitleContent(titleContent){
	let title = document.querySelector('title');

	title ? title.innerHTML = titleContent : null;
}

function getMetaDescription(){
	let metaDescription = document.querySelector('meta[name="description"]');

	return metaDescription ? metaDescription.getAttribute('content') : '';
}

function setMetaDescription(description){
	let metaDescription = document.querySelector('meta[name="description"]');

	metaDescription ? metaDescription.setAttribute('content', description) : null;
}
