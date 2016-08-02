var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

/*---------------*/

var argv = require('./argv');

var plugins = [];
var ENV = require('./.env.js');

/*---------------*/

for(var i = 0, imax = ENV.plugins.length;i<imax;i++){
	plugins.push(ENV.plugins[i]);
}

delete ENV.plugins;

/*---------------*/

plugins.push(
	new webpack.DefinePlugin({
	  "window.ENV": JSON.stringify(ENV)
	})
);

var extract = !!argv.extract;

if (extract){
	ENV.publicPath = './build/';
}

plugins.push(
	new ExtractTextPlugin("stylesheet.css", {
		allChunks: true,
        disable: !extract
    })
);

/*---------*/

module.exports = {
	entry: "./sources/main/root.jsx",
	output: {
		path: path.join(__dirname, 'build'),
		publicPath: ENV.publicPath,
		filename: "bundle.js"
	},
	devtool: 'source-map',
	devServer: {
		contentBase: __dirname,
		hot: true,
		port: 3000,
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 500
		}
	},
	resolve: {
    	extensions: ['', '.js', '.jsx'],
		modulesDirectories: ["sources/main", "sources/generated", "web_modules", "node_modules"]
	},
	plugins: plugins,
	module: {
		loaders: [
			{
                test: /\.glsl$/,
                loader: 'webpack-glsl'
            },
			{
				test: /\.json$/,
				loader: "json"
			},
			{
				test: /\.react\.jade$/,
				loader: "jade-react" 
			},
			{
				test: /\.jade$/,
				exclude: /\.react\.jade$/,
				loader: "jade"
			},
			{
				test: /\.(js?|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.styl?$/,
				exclude: /(node_modules|bower_components)/,
				loader: ( extract ?
					ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader?resolve url')
					: 'style-loader!css-loader!stylus-loader?resolve url'
				)	
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	},
	babel: {
		plugins: [['transform-es2015-classes', {loose: true}]]
	},
	stylus: {
		use: [require('nib')()],
		import: [
			'~nib/lib/nib/index.styl',
			'~assets/spritesheets/sprites.styl',

			//comment/uncomment lines if no files matching
			path.join(__dirname, 'sources/*/settings/**/*.styl'),
			path.join(__dirname, 'sources/*/tools/**/*.styl'),
			path.join(__dirname, 'sources/*/view/**/*.styl'),
			// path.join(__dirname, 'sources/abstract/**/*.styl')
		]
	}
};