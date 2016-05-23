var path = require('path');
var webpack = require('webpack');

var plugins = [];

var ENV = require('./.env.js');

for(var i = 0, imax = ENV.plugins.length;i<imax;i++){
	plugins.push(ENV.plugins[i]);
}
delete ENV.plugins;

plugins.push(
	new webpack.BannerPlugin('window.ENV = '+JSON.stringify(ENV)+';', {
		raw: true,
		entryOnly: true
	})
);

module.exports = {
	entry: "./sources/main.js",
	output: {
		path: path.join(__dirname, 'build'),
		publicPath: ENV.publicPathRoot+"/design/galerieslafayetteevents/integration/build/",
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
		modulesDirectories: ["web_modules", "node_modules"]
	},
	plugins: plugins,
	module: {
		loaders: [
			{
				test: /\.jade$/,
				loader: "jade"
			},
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.styl?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'style-loader!css-loader!stylus-loader?resolve url'
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
			path.join(__dirname, 'sources/settings/*.styl'),
			path.join(__dirname, 'sources/tools/*.styl'),
			path.join(__dirname, 'sources/tools/*/*.styl')
		]
	}
};