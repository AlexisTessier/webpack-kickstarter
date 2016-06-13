'use strict';

var CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

var plugins = [];

plugins.push(new CssSourcemapPlugin());

module.exports = {
	name: 'dev',
	publicPath: "http://project.dev/app/build/",
	plugins: plugins
};