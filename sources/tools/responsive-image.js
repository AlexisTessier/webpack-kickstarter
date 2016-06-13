import {forEach, chain} from 'lodash'
import dom from '@alexistessier/dom'

let responsiveImageList;

function setImageSource (node, sizeClass) {
	if (!sizeClass) {return null;}

	switch(node.tagName.toLowerCase()){
		case 'img':
			node.setAttribute('width', sizeClass.width);
			node.setAttribute('height', sizeClass.height);
			node.setAttribute('href', sizeClass.url);
		break;

		default:
			node.setAttribute('background-image', sizeClass.url);

			node.setAttribute('style', [
				'background-image:url("'+sizeClass.url+'");',
				'width:'+sizeClass.width+'px;',
				'height:'+sizeClass.height+'px;'
			].join(''));
		break;
	}
}

let responsiveImage = {
	setup : function () {
		responsiveImageList = [];
		dom.forEach(dom.select('[data-responsive-image]'), function (node) {
			responsiveImageList.push({
				node,
				data: JSON.parse(dom.getData(node, 'responsive-image'))
			})
		});
		responsiveImage.update('default');
	},
	update: function(sizeClass) {
		forEach(responsiveImageList, function (img) {
			setImageSource(img.node, img.data.sizeClass[sizeClass] || img.data.sizeClass['default']);
		});
	}
};

export default responsiveImage;