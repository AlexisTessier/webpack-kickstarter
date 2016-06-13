var glob = require('glob');
var SVGO  = require('svgo');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var dom = require('@alexistessier/dom');

var svgo = new SVGO();
var svgpath = require('svgpath');

var jsdom = require("jsdom");

var SvgComponentGenerator = (function() {
	'use strict';

	function SvgComponentGenerator(params) {
		// enforces new
		if (!(this instanceof SvgComponentGenerator)) {
			return new SvgComponentGenerator(params);
		}
		
		this.inputPath = params.inputPath;
		this.outputPath = params.outputPath;
		this.outputExt = params.outputExt || '.svg';
		this.sizeAliases = params.sizeAliases;

		this.generatedList = {};
	}

	SvgComponentGenerator.prototype.run = function() {
		var self = this;
		this.totalCount = 0;
		this.totalGeneratedCount = 0;

		glob(path.join(this.inputPath, '*.svg'), function (err, fileList) {
			self.totalCount+= _.size(fileList);

			_.forEach(fileList, function (filePath) {
				self.optimizeFile(filePath, function (name, originalSize, sizeAliases, data) {

					self.totalCount+=_.size(sizeAliases);

					self.createComponent(name, '', originalSize, data, originalSize, function () {
						self.generateToolAtEnd();
					});

					_.forEach(sizeAliases, function (sizeInline, alias) {
						var size = {
							width: sizeInline.split('x')[0],
							height: sizeInline.split('x')[1]
						};

						self.createComponent(name, alias, size, data, originalSize, function () {
							self.generateToolAtEnd();
						});
					});
				});
			});
		})
	};

	SvgComponentGenerator.prototype.optimizeFile = function(filePath, callback) {
		var basename = path.basename(filePath, '.svg');
		var sizeAliases = this.sizeAliases[basename] || {};

		fs.readFile(filePath, 'utf8', function(err, data) {
			if (err) {
				throw err;
			}

			svgo.optimize(data, function(result) {
				callback(basename, {width:result.info.width, height:result.info.height}, sizeAliases, result.data);
			});
		});
	};

	SvgComponentGenerator.prototype.generateToolAtEnd = function() {
		if(this.totalGeneratedCount >= this.totalCount && this.totalGeneratedCount > 0){
			var jsonData = JSON.stringify(this.generatedList);

			var tab = '\t', newLine = '\n';

			var fileContent = newLine
				+'svgComponent__data = '+jsonData
				+newLine+newLine
				+'svgComponent__absoluteCenter(svgName, containerWidth, containerHeight = containerWidth, centerX = true, centerY = true)'
				+newLine+tab+'svgElement = svgComponent__data[svgName]'
				+newLine+tab+'svgClass = svgElement.className'
				+newLine+tab+'svgWidth = svgElement.width'
				+newLine+tab+'svgHeight = svgElement.height'
				+newLine+tab+'topPosition = ((containerHeight - svgHeight) / 2)'
				+newLine+tab+'leftPosition = ((containerWidth - svgWidth) / 2)'
				+newLine
				+newLine+tab+'.{svgClass}'
				+newLine+tab+tab+'position absolute'
				+newLine+tab+tab+'if centerY'
				+newLine+tab+tab+tab+'top (topPosition)px'
				+newLine+tab+tab+'if centerX'
				+newLine+tab+tab+tab+'left (leftPosition)px'
				+newLine+newLine
				+'svgComponent__absoluteAlignCenter(svgName, targetWidth, targetHeight = targetWidth, centerX = true, centerY = true)'
				+newLine+tab+'svgElement = svgComponent__data[svgName]'
				+newLine+tab+'svgWidth = svgElement.width'
				+newLine+tab+'svgHeight = svgElement.height'
				+newLine+tab+'topPosition = -((targetWidth - svgHeight) / 2)'
				+newLine+tab+'leftPosition = -((targetWidth - svgWidth) / 2)'
				+newLine
				+newLine+tab+'position absolute'
				+newLine+tab+'if centerY'
				+newLine+tab+tab+'top (topPosition)px'
				+newLine+tab+'if centerX'
				+newLine+tab+tab+'left (leftPosition)px'
				+newLine+newLine
				+'svgComponent__wrapper(svgName)'
				+newLine+tab+'svgElement = svgComponent__data[svgName]'
				+newLine+tab+'svgWidth = svgElement.width'
				+newLine+tab+'svgHeight = svgElement.height'
				+newLine
				+newLine+tab+'width (svgWidth)px'
				+newLine+tab+'height (svgHeight)px'
				+newLine+tab+'> svg'
				+newLine+tab+tab+'display block'
			;

			this.save(path.join(__dirname, 'sources/tools/svgComponent.styl'), fileContent);
		}
	};

	SvgComponentGenerator.prototype.createComponent = function(name, aliasName, size, data, originalSize, callback) {
		var self = this;
		var modifier = _.trim(aliasName).length > 0 ? '--'+_.kebabCase(aliasName) : '';
		var elementClass = _.upperFirst(_.camelCase(name))+modifier;
		var fileNameBase = _.kebabCase(name)+modifier;
		var fileName = fileNameBase+this.outputExt;

		var outputPath = path.join(this.outputPath, fileName);

		var sx = size.width/originalSize.width;
		var sy = size.height/originalSize.height;

		jsdom.env(data, [], function (err, window) {
			var all = window.document.querySelectorAll('*');

			dom.forEach(all, function (el) {
				el.removeAttribute('id');
			});

			var svgroot = window.document.querySelector('svg');
			svgroot.setAttribute('class', elementClass);
			var viewBox = (svgroot.getAttribute('viewBox') || '0 0 '+size.width+' '+size.height).split(' ');

			viewBox[0] = viewBox[0] * sx;
			viewBox[1] = viewBox[1] * sy;
			viewBox[2] = size.width;
			viewBox[3] = size.height;

			self.generatedList[fileNameBase] = {
				name: fileNameBase,
				className: elementClass,
				width: parseInt(viewBox[2], 10),
				height: parseInt(viewBox[3], 10)
			};

			self.totalGeneratedCount++;
			callback();

			svgroot.setAttribute('viewBox', viewBox.join(' '));
			svgroot.setAttribute('width', size.width);
			svgroot.setAttribute('height', size.height);

			var pathList = window.document.querySelectorAll('path');

			dom.forEach(pathList, function (path) {
				var transformed = svgpath(path.getAttribute('d'))
                    .scale(sx, sy)
                    .translate(0,0)
                    .rel()
                    .round(10)
                    .toString();

                path.setAttribute('d', transformed);
			});

			var fileContent = window.document.querySelector('body').innerHTML;

			self.save(outputPath, fileContent);
		});
	};

	SvgComponentGenerator.prototype.save = function(path, content) {
		fs.writeFile(path, content, {encoding: 'utf8'}, function (err) {
			if (err) throw err;

			console.log('file save at path '+path);
		});
	};

	return SvgComponentGenerator;
}());

module.exports = SvgComponentGenerator;