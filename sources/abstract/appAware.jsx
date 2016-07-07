import React from 'react'
import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export function appAware(ComponentToWrap){
	class AppComponent extends Component {
		render() {
			const { app, sizeClassHelper, Link, route, transition } = this.context;
			return (
				<ComponentToWrap {...this.props} 
					app={app}
					sizeClassHelper={sizeClassHelper} 
					Link={Link}
					route={route}
					transition={transition}
				/>
			)
		}
	}

	AppComponent.contextTypes = {
		app: PropTypes.object.isRequired,
		sizeClassHelper: PropTypes.object.isRequired,
		Link: PropTypes.func.isRequired,
		route: PropTypes.object.isRequired,
		transition: PropTypes.object
	}

	return AppComponent;
}