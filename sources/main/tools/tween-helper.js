import ease from 'tools/ease';

import assert from 'assert';

import {isObject, isString, isArray, isNumber, camelCase, isFunction, map, mapValues, forEach} from 'lodash';

let tweenIdentifierCount = 0;

let applyReset = Symbol(), computeTweenValue = Symbol();

export default class TweenHelper{
	constructor({
	} = {}) {
		this.tweenList = {};
	}

	inject({
		frame = window
	} = {}){

		this.frame = frame;

		return this;
	}

	init(){
		let self = this;
		
		this.startDate = Date.now();
		this.currentDate = this.startDate;
		this.previousDate = this.startDate;
		this.totalTime = 0;
		this.deltaTime = 0;

		this.frame.requestAnimationFrame(function loop() {
			self.currentDate = Date.now();
			self.deltaTime = self.currentDate - self.previousDate;
			self.totalTime += self.deltaTime;

			self.timeUpdate({
				start: self.startDate,
				current: self.currentDate,
				previous: self.previousDate,
				total: self.totalTime,
				delta: self.deltaTime
			});

			self.previousDate = self.currentDate;

			self.frame.requestAnimationFrame(loop);
		});

		return this;
	}

	timeUpdate(time) {
		let toRemove = [], self = this;

		forEach(this.tweenList, (tween)=>{
			if (tween.ended) {
				if (tween.endBlock && tween.active){
					tween.endBlock(tween.currentValue, tween);
				}

				if(tween.mustBeRemoved){
					toRemove.push(tween.identifier);
				}
			}
			else{
				tween.active = true;
				tween.currentTime += (tween.pause ? 0 : time.delta);

				tween.afterDelayTime = Math.max(0, tween.currentTime - tween.delay);
				tween.started = tween.afterDelayTime > 0;

				tween.cursor = tween.afterDelayTime/tween.duration;
				
				tween.ended = tween.afterDelayTime >= tween.duration;

				this[computeTweenValue](tween);

				if (tween.updateBlock) {
					tween.updateBlock(tween.currentValue, tween);
				}
			}
		});

		forEach(toRemove, function (tweenIdentifier) {
			delete self.tweenList[tweenIdentifier];
		});
	}

	getTween(identifier){
		return isObject(identifier) ? identifier : this.tweenList[identifier];
	}

	pause(tweenIdentifier){
		this.getTween(tweenIdentifier).pause = true;
	}

	play(tweenIdentifier){
		this.getTween(tweenIdentifier).pause = false;
	}

	stop(tweenIdentifier){
		this.reset(tweenIdentifier);
		this.pause(tweenIdentifier);
	}

	reset(tweenIdentifier){
		this[applyReset](this.getTween(tweenIdentifier));
	}

	remove(tweenIdentifier){
		let tween = this.getTween(tweenIdentifier);
		tween.ended = true;
		tween.active = false;
		tween.mustBeRemoved = true;
	}

	[computeTweenValue](tween){
		tween.easeFactor = tween.easingFunction(tween.cursor);
		tween.currentValue = tween.startValue + (tween.interval*tween.easeFactor);
	}

	[applyReset](tween){
		tween.currentTime = 0;
		tween.afterDelayTime = 0;
		tween.cursor = 0;
		tween.currentValue = tween.startValue;
		tween.ended = false;
		tween.active = false;
		tween.started = false;

		this[computeTweenValue](tween);
	}

	tween(params, /*function(tweenCurrentValue, tween)*/ updateBlock = null, /*function(tweenCurrentValue, tween)*/ endBlock = null) {
		let tweenIdentifier = params.identifier || this.newTweenIdentifier();

		let startValue = params.startValue || 0;
		let endValue = params.endValue || 1;

		let tweenObject = {
			duration : setTimeValue(params.duration),
			startValue : startValue,
			endValue : endValue,
			easingFunction : isFunction(params.easing) ? params.easing : (ease[params.easing] || ease.none),
			updateBlock : isFunction(updateBlock) ? updateBlock : null,
			endBlock : isFunction(endBlock) ? endBlock : null,
			interval : endValue-startValue,
			identifier : tweenIdentifier,
			delay: setTimeValue(params.delay || '0ms'),
			pause: typeof params.wait === 'boolean' ? params.wait : false,
			mustBeRemoved: typeof params.mustBeRemoved === 'boolean' ? params.mustBeRemoved : true,
		};

		this[applyReset](tweenObject);

		this.tweenList[tweenIdentifier] = tweenObject;

		return tweenObject;
	}

	changeTweenTarget(tweenIdentifier, target){
		let tween = this.getTween(tweenIdentifier);
		tween.startValue = tween.currentValue;
		tween.endValue = target;
		tween.interval = tween.endValue - tween.startValue;
		this[applyReset](tween);
	}

	newTweenIdentifier(){
		let tweenIdentifier = "animation_manager_tween_"+tweenIdentifierCount++;
		return this.tweenList[tweenIdentifier] ? this.newTweenIdentifier() : tweenIdentifier;
	}

	interpolate(startValue, endValue, cursor = 0.5){
		if (isNumber(startValue)) {
			return startValue + ((endValue-startValue)*cursor);
		}

		if (isArray(startValue)) {
			return map(startValue, (val, index)=>{
				return this.interpolate(val, endValue[index], cursor);
			});
		}

		if(isObject(startValue)) {
			return mapValues(startValue, (val, key)=>{
				return this.interpolate(val, endValue[key], cursor);
			});
		}
	}

	interpolation(startValue, endValue, duration, easingFunction = 'none', delay = '0ms'){
		//interpolation(
		// {x:5, y:8},
		// {x:32, y:120},
		// '800ms',
		// 'inOut',
		// '200ms'
		//)
		//.wait()
		//.update(o=>{
		//	o.x;
		//	o.y;
		//})
		if(isString(startValue)){
			return (...args)=>{
				return this.interpolation(...args).identifier(startValue);
			}
		}

		let tweenParams = {
			identifier: this.newTweenIdentifier(),
			duration,
			easingFunction,
			delay
		};

		let interpolation = {
			startValue,
			endValue,
			active: false
		};
		let tween = null;
		let _update = null, _end = null;

		let updateBlock = (cursor, tween)=>{
			if(_update){
				interpolation.currentValue = this.interpolate(interpolation.startValue, interpolation.endValue, cursor);
				_update(interpolation.currentValue, tween);
			}
		};

		let endBlock = (currentValue, tween)=>{
			if(_end){
				interpolation.currentValue = this.interpolate(interpolation.startValue, interpolation.endValue, cursor);
				_end(interpolation.currentValue, tween);
			}
		};

		interpolation.identifier = (identifier = null)=>{
			if(identifier){
				tweenParams.identifier = identifier;
			}

			return interpolation;
		};

		interpolation.tween = ()=>{
			return tween;
		};

		interpolation.wait = (wait = true)=>{
			tweenParams.wait = wait;

			return interpolation;
		};

		interpolation.duration = (duration)=>{
			tweenParams.duration = setTimeValue(duration);

			return interpolation;
		};

		interpolation.easingFunction = (easingFunction)=>{
			tweenParams.easingFunction = easingFunction;

			return interpolation;
		};

		interpolation.delay = (delay = '0ms')=>{
			tweenParams.delay = setTimeValue(delay);

			return interpolation;
		};

		interpolation.mustBeRemoved = (mustBeRemoved = true)=>{
			tweenParams.mustBeRemoved = mustBeRemoved;

			return interpolation;
		};

		interpolation.update = (update)=>{
			_update = isFunction(update) ? update : null;

			tween = tween || this.tween(tweenParams, updateBlock, endBlock);

			if(!interpolation.active){
				interpolation.currentValue = this.interpolate(interpolation.startValue, interpolation.endValue, tween.easeFactor);
			}

			interpolation.active = true;

			return interpolation;
		};

		interpolation.end = (end)=>{
			_end = isFunction(end) ? end : null;
			
			tween = tween || this.tween(tweenParams, updateBlock, endBlock);

			if(!interpolation.active){
				interpolation.currentValue = this.interpolate(interpolation.startValue, interpolation.endValue, tween.easeFactor);
			}

			interpolation.active = true;

			return interpolation;
		};

		interpolation.changeTarget = (newTarget)=>{
			interpolation.startValue = interpolation.currentValue;
			interpolation.endValue = newTarget;
			this.reset(interpolation.tween());
		}

		interpolation.pause = ()=>{
			this.pause(interpolation.tween());
		}

		interpolation.play = ()=>{
			this.play(interpolation.tween());
		}

		interpolation.stop = ()=>{
			this.stop(interpolation.tween());
		}

		interpolation.remove = ()=>{
			this.remove(interpolation.tween());
		}

		return interpolation;
	}

	//queue(
	//	{ duration:500 }, x=>( console.log(x) ),
	//	{ duration:800, easingFunction:'inOutQuad'} , x=>( console.log(x) )
	//)

	//interpolationQueue
}

function setTimeValue(timeValue){
	let numberValue = parseInt(timeValue, 10);

	assert(timeValue === numberValue+'ms', 'Time parameters must be defined using strings and a "ms" unit as the following example: "250ms"');

	return numberValue;
};