import assert from 'assert'

import {
	isObject,
	isFunction,
	includes
} from 'lodash'

import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import { Router, Link } from 'react-router'

/*----------------------------------*/

export function appAware(ComponentToWrap){
	class AppComponent extends Component {
		render() {
			const { app, sizeClassHelper, Link, route } = this.context;
			return (
				<ComponentToWrap {...this.props} 
					app={app}
					sizeClassHelper={sizeClassHelper} 
					Link={Link}
					route={route}
				/>
			)
		}
	}

	AppComponent.contextTypes = {
		app: PropTypes.object.isRequired,
		sizeClassHelper: PropTypes.object.isRequired,
		Link: PropTypes.func.isRequired,
		route: PropTypes.object.isRequired
	}

	return AppComponent
}

/*----------------------------------*/

export default class App extends Component{
	constructor(props) {
		super(...arguments);

		this.state = {
			mustActiveFastClick: this.props.fastclick === true
		}
	}

	static get defaultProps(){
		return {
			title: getTagTitleContent(),
			fastclick: false,
			description: getMetaDescription()
		};
	}

	static get propTypes() {
		return {
			sizeClassHelper: PropTypes.object.isRequired,
			rootRoute: PropTypes.object.isRequired,
			routes: PropTypes.object.isRequired,
			history: PropTypes.object.isRequired
		}
	}

	getChildContext() {
		return {
			app: this,
			sizeClassHelper: this.props.sizeClassHelper,
			Link,
			route: this.props.routes
		}
	}

	static get childContextTypes() {
		return {
			app: PropTypes.object.isRequired,
			sizeClassHelper: PropTypes.object.isRequired,
			Link: PropTypes.func.isRequired,
			route: PropTypes.object.isRequired
		}
	}

	/*----------------------*/

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
		return (
			<div className='App'>
				<Router routes={this.props.rootRoute} history={this.props.history} />
			</div>
		)
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
