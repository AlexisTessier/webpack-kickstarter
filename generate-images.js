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
		var reactContent = [
			"import React from 'react'",
			"import {Component, PropTypes} from 'react'",
			"import ReactDOM from 'react-dom'",
			"",
			"export default function "+componentName+" (){",
			"	return "+content+";",
			"}"
		].join('\n');

		return [{
			name: componentName+'/index.jsx',
			content: reactContent
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