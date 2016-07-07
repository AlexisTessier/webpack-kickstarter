'use strict';

var CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

var plugins = [];

plugins.push(new CssSourcemapPlugin());

module.exports = {
	name: 'dev',
	publicPath: "http://localhost:3000/build/",
	plugins: plugins
};