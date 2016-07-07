let route = {
	path: require('./index').help(),

	getComponent(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, require('component/HelpPage').default)
		})
	}
};

export default route;