var path = require('path');

var sourcesGenerators = [
	path.join(__dirname, 'generate-images.js'),
	path.join(__dirname, 'generate-modernizr.js')
];

for(var i = 0, imax = sourcesGenerators.length; i < imax; i++){
	require(sourcesGenerators[i]);
}