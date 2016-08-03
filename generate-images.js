var path = require('path');
var _ = require('lodash');

/*----------------------------*/

var SvgComponentGenerator = require('./svg-component-generator');

var inputPath = path.join(__dirname, 'sources/main/assets/images/svg');

var svgGen = new SvgComponentGenerator({
	inputPath: inputPath,
	classAttributeString: 'className',
	attributesToRemove: ['id', 'xmlns'],
	toolsOutputPath: path.join(__dirname, 'sources/generated/tools/svgComponent.styl'),
	outputPath: path.join(__dirname, './sources/generated/component'),
	sizeAliases: require(path.join(inputPath, 'size-aliases.js')),
	fileContentTransformMethod: function (name, content) {
		var componentName = _.upperFirst(_.camelCase(name));
		var componentContent = [
			"export default function "+componentName+" (){",
			"	return \""+_.replace(_.replace(_.replace(_.replace(content, '"', '\\"'), '\t', ''), '\n', ''), '\r', '')+"\";",
			"}"
		].join('\n');

		return [{
			name: componentName+'/index.js',
			content: componentContent
		}]
	}
});

svgGen.run();

/*----------------------------*/

var SpritesheetGenerator = require('@alexistessier/spritesheet-generator/factory');

var spritesheetsGen = SpritesheetGenerator({
    inputPath : path.join(__dirname, 'sources/main/assets/images/png'),
    outputPath : path.join(__dirname, 'sources/generated/assets/spritesheets'),
    processor : 'stylus',
    retina: true,
    imageUrlGenerationStrategy: 'relative'
});

spritesheetsGen.run();