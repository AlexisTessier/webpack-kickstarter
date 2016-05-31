'use strict';

var argv = require('minimist')(process.argv.slice(2));

var CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

var envName = typeof argv.env === 'string' ? argv.env : 'prod';

var plugins = [];

if (envName === 'dev') {
	plugins.push(new CssSourcemapPlugin());
}

var ENV = {
	name: envName,
	publicPathRoot : (envName === 'dev' ? "http://project.dev" : '' )+"/path/to/build/",
	plugins: plugins
};

module.exports = ENV;