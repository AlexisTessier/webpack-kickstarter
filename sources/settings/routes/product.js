let route = {
	path: require('./index').product(),

	// getChildRoutes(partialNextState, callback) {
	//   require.ensure([], function (require) {
	//     callback(null, [
	//       require('./product')
	//     ])
	//   })
	// },

	getComponent(partialNextState, callback) {
		require.ensure([], function (require) {
			callback(null, require('component/Product').default)
		})
	}
};

export default route;