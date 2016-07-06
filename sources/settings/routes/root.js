let route = {
	path: require('./index').root(),

	component: require('component/App').AppRouteTransitionLayout,

	getChildRoutes(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, [
				require('./products.js').default,
				require('./product.js').default
			])
		})
	},

	getIndexRoute(partialNextState, callback) {
		require.ensure([], function (require) {
			let index = Object.assign({}, require('./products.js').default);
			delete index.path;
			callback(null, index);
		})
	}
};

export default route;