let route = {
	path: require('./index').products(),

	getComponent(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, require('component/ProductList').default)
		})
	}
};

export default route;