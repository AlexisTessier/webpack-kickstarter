import {isArray, isFunction, isObject, forEach, isNumber, isString, includes} from 'lodash'

import eventEmitterFactory from 'event-emitter';

import dom from '@alexistessier/dom';

class SizeClassHelper {
	constructor({
		frame = window,
		wrapper = dom.get('html'),
		body = dom.get('body'),
		classPrefix = 'size-class',
		screenFrameName= 'sizeClassHelper_screenFrame'
	} = {}) {

		this.option = {
			wrapper, classPrefix, body, screenFrameName
		};

		this.availableEventList = ['resize', 'change'];
		this.eventEmitter = eventEmitterFactory({});

		this.size = {};
		this.sizeClassList = {};
		this.activeSizeClassList = [];
		this.sizeClassState = {};
		this.frame = frame;

		this.needUpdate = false;

		dom.ready(()=>{
			this.domReadyEvent()
		});
	}

	domReadyEvent(){
		this.needUpdate = true;

		this.screenFrame = dom.create('div', this.option.screenFrameName);
		dom.appendChild(this.option.body, this.screenFrame);

		this.screenFrame.setAttribute('style', 'z-index:-120;display:block;position:fixed;top:0;left:0;width:100%;height:100%;');

		this.on('resize', size => {
			this.updateDevice(size);
		});

		this.on('change', sizeClassList => {
			this.updateSizeClass(sizeClassList);
		});

		this.updateSize(true);
		this.startLoop();

		return this;
	}


	/*--------------------------*/
	/*-- Component interfaces --*/
	/*--------------------------*/

	on(){
		return this.eventEmitter.on(...arguments);
	}

	off(){
		return this.eventEmitter.off(...arguments);
	}

	/*--------------------------*/
	/*--------------------------*/
	/*--------------------------*/

	setSizeClass(sizeClassName, sizeClass){
		this.sizeClassList[sizeClassName] = {
			name: sizeClassName,
			test: sizeClass
		};

		this.needUpdate = true;
	}

	startLoop(){
		this.frame.requestAnimationFrame(()=>{
			this.updateSize(this.needUpdate);
			this.startLoop();
		});
	}

	get devicePixelRatio(){
		return this.frame.devicePixelRatio || (window ? window.devicePixelRatio : null) || null;
	}

	get deviceWidth(){
		return dom.width(this.screenFrame);
	}

	get deviceHeight(){
		return dom.height(this.screenFrame);
	}

	updateSize(force = false){
		let previousWidth = this.size.width, previousHeight = this.size.height,
			currentWidth = this.deviceWidth, currentHeight = this.deviceHeight,
			widthResize = previousWidth !== currentWidth, heightResize = previousHeight !== currentHeight;

		this.size = {
			width: currentWidth,
			height: currentHeight
		};

		this.resizeEmitParams = [{
			currentWidth,
			currentHeight,
			widthResize,
			heightResize,
			previousWidth,
			previousHeight,
			currentPixelRatio: this.devicePixelRatio
		}];

		if (widthResize || heightResize || force) {
			this.emitResize();
		}
	}

	emitResize(){
		this.eventEmitter.emit('resize', ...this.resizeEmitParams);
	}

	isActive(sizeClass){
		return !!(this.sizeClassState[sizeClass]);
	}

	updateDevice(size){
		this.needUpdate = false;
		let activeSizeClassList = [];

		forEach(this.sizeClassList, (sizeClass, sizeClassName)=>{
			this.sizeClassState[sizeClassName] = false;

			if (this.testSizeClass(size, sizeClass)) {
				this.sizeClassState[sizeClassName] = true;
				activeSizeClassList.push(sizeClassName);
			}
		});

		if (this.activeSizeClassList.join('%') !== activeSizeClassList.join('%')) {
			this.eventEmitter.emit('change', {
				currentSizeClassState: this.sizeClassState,
				currentSizeClassList: activeSizeClassList
			});
		}

		this.activeSizeClassList = activeSizeClassList;
	}

	testSizeClass(size, sizeClassWrapper, sizeClassNameRecursive = [], recursiveCacheResult = {}){
		sizeClassNameRecursive.push(sizeClassWrapper.name);

		let sizeClass = sizeClassWrapper.test;

		if(isArray(sizeClass)){
			let type = isString(sizeClass[0]) ? sizeClass.shift() : 'and';

			if (type === 'or') {
				for(let i = 0, imax = sizeClass.length; i < imax; i++){
					if (this.testSizeClass(size, sizeClass[i])) {
						return true;
					}
				}

				return false;
			}

			if (type === 'and') {
				for(let i = 0, imax = sizeClass.length; i < imax; i++){
					if (!this.testSizeClass(size, sizeClass[i])) {
						return false;
					}
				}

				return true;
			}

			return false;
		}

		if (isString(sizeClass)) {
			if (!includes(sizeClassNameRecursive, sizeClass)) {
				recursiveCacheResult[sizeClass] = this.testSizeClass(size, this.sizeClassList[sizeClass], sizeClassNameRecursive, recursiveCacheResult);
			}

			return recursiveCacheResult[sizeClass];
		}

		if (isFunction(sizeClass)) {
			return sizeClass(size.currentWidth, size.currentHeight, size.currentPixelRatio);
		}

		if (isNumber(sizeClass.minWidth) && size.currentWidth < sizeClass.minWidth) {
			return false;
		}

		if (isNumber(sizeClass.maxWidth) && size.currentWidth > sizeClass.maxWidth) {
			return false;
		}

		if (isNumber(sizeClass.minHeight) && size.currentHeight < sizeClass.minHeight) {
			return false;
		}

		if (isNumber(sizeClass.maxHeight) && size.currentHeight > sizeClass.maxHeight) {
			return false;
		}

		if (isNumber(sizeClass.minPixelRatio) && size.currentPixelRatio < sizeClass.minPixelRatio) {
			return false;
		}

		if (isNumber(sizeClass.maxPixelRatio) && size.currentPixelRatio > sizeClass.maxPixelRatio) {
			return false;
		}

		return true;
	}

	updateSizeClass(data){
		forEach(data.currentSizeClassState, (active, sizeClass) => {
			dom[active ? 'addClass' : 'removeClass'](this.option.wrapper, this.option.classPrefix+'-'+sizeClass);
			dom[!active ? 'addClass' : 'removeClass'](this.option.wrapper, this.option.classPrefix+'-not-'+sizeClass);
		});
	}
}

export default SizeClassHelper;