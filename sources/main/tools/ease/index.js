var ease = (function() {
	'use strict';

	var ease = {};

	ease.none = function easeNone(t){
		return t;
	};

	ease.linear = function easeLinear(t){
		return t;
	};

	ease.inQuad = function easeInQuad(t){
		return t*t;
	};

	ease.outQuad = function easeOutQuad(t){
		return t*(2.00-t);
	};

	ease.inOutQuad = function easeInOutQuad(t){
		return t<0.50 ? 2.00*t*t : -1.00+(4.00-2.00*t)*t;
	};

	ease.inCubic = function easeInCubic(t){
		return t*t*t;
	};

	ease.outCubic = function easeOutCubic(t){
		return (--t)*t*t+1.00;
	};

	ease.inOutCubic = function easeInOutCubic(t){
		return t<0.50 ? 4.00*t*t*t : (t-1.00)*(2.00*t-2.00)*(2.00*t-2.00)+1.00;
	};

	ease.inQuart = function easeInQuart(t){
		return t*t*t*t;
	};
	
	ease.outQuart = function easeOutQuart(t){
		return 1-(--t)*t*t*t;
	};

	ease.inOutQuart = function easeInOutQuart(t){
		return t<0.50 ? 8.00*t*t*t*t : 1.00-8.00*(--t)*t*t*t;
	};

	ease.inQuint = function easeInQuint(t){
		return t*t*t*t*t;
	};

	ease.outQuint = function easeOutQuint(t){
		return 1.00+(--t)*t*t*t*t;
	};

	ease.inOutQuint = function easeInOutQuint(t){
		return t<0.50 ? 16.00*t*t*t*t*t : 1.00+16.00*(--t)*t*t*t*t;
	};

	/*--------*/

	// var custom = {};

	// /*---------*/

	// custom.inOut = function easeCreateInOut({
	// 	friction = custom.inOut.options.friction
	// }={}){
	// 	return custom.bezier({
	// 		points: [
	// 		    { x:0, y:0, cp:[{ x:0.92 - (friction / 1000), y:0 }] },
	// 		    { x:1, y:1, cp:[{ x:0.08 + (friction / 1000), y:1 }] }
	// 		]
	// 	});
	// }

	// custom.inOut.options = {
	// 	friction: 500
	// };

	// /*---------*/

	// ease.custom = custom;

	return ease;
}());

export default ease;