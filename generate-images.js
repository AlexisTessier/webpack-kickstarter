var path = require('path');

/*----------------------------*/

var SvgComponentGenerator = require('./svg-component-generator');

var inputPath = path.join(__dirname, 'sources/assets/images/svg');

var svgGen = new SvgComponentGenerator({
	inputPath: inputPath,
	outputPath: path.join(__dirname, './sources/component'),
	sizeAliases: require(path.join(inputPath, 'size-aliases.js'))
});

svgGen.run();

/*----------------------------*/

var SpritesheetGenerator = require('@alexistessier/spritesheet-generator/factory');

var spritesheetsGen = SpritesheetGenerator({
    inputPath : path.join(__dirname, 'sources/assets/images/png'),
    outputPath : path.join(__dirname, 'web_modules/spritesheets'),
    processor : 'stylus',
    retina: true,
    imageUrlGenerationStrategy: 'relative'
});

spritesheetsGen.run();