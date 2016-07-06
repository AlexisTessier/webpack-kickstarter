let route = {
	path: require('./index').product(),

	getComponent(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, require('component/Product').default)
		})
	}
};

export default route;