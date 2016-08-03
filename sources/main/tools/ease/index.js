let ease = {};

/*--------*/

export function easeNone(t){
	return t;
};

ease.none = easeNone;

/*--------*/

export function easeLinear(t){
	return t;
};

ease.linear = easeLinear;

/*--------*/

export function easeInQuad(t){
	return t*t;
};

ease.inQuad = easeInQuad;

/*--------*/

export function easeOutQuad(t){
	return t*(2.00-t);
};

ease.outQuad = easeOutQuad;

/*--------*/

export function easeInOutQuad(t){
	return t<0.50 ? 2.00*t*t : -1.00+(4.00-2.00*t)*t;
};

ease.inOutQuad = easeInOutQuad;

/*--------*/

export function easeInCubic(t){
	return t*t*t;
};

ease.inCubic = easeInCubic;

/*--------*/

export function easeOutCubic(t){
	return (--t)*t*t+1.00;
};

ease.outCubic = easeOutCubic;

/*--------*/

export function easeInOutCubic(t){
	return t<0.50 ? 4.00*t*t*t : (t-1.00)*(2.00*t-2.00)*(2.00*t-2.00)+1.00;
};

ease.inOutCubic = easeInOutCubic;

/*--------*/

export function easeInQuart(t){
	return t*t*t*t;
};

ease.inQuart = easeInQuart;

/*--------*/

export function easeOutQuart(t){
	return 1-(--t)*t*t*t;
};

ease.outQuart = easeOutQuart;

/*--------*/

export function easeInOutQuart(t){
	return t<0.50 ? 8.00*t*t*t*t : 1.00-8.00*(--t)*t*t*t;
};

ease.inOutQuart = easeInOutQuart;

/*--------*/

export function easeInQuint(t){
	return t*t*t*t*t;
};

ease.inQuint = easeInQuint;

/*--------*/

export function easeOutQuint(t){
	return 1.00+(--t)*t*t*t*t;
};

ease.outQuint = easeOutQuint;

/*--------*/

export function easeInOutQuint(t){
	return t<0.50 ? 16.00*t*t*t*t*t : 1.00+16.00*(--t)*t*t*t*t;
};

ease.inOutQuint = easeInOutQuint;

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

export default ease;