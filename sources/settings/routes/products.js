let route = {
	path: require('./index').products(),

	getChildRoutes(partialNextState, callback) {
	  require.ensure([], function (require) {
	    callback(null, [
	      require('./product').default
	    ])
	  })
	},

	getIndexRoute(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, {
				component: require('component/ProductList').default
			})
		})
	}
};

export default route;