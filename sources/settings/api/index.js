import {
	isArray
} from 'lodash'

export default {
	name: 'xebia',
	host:'http://henri-potier.xebia.fr',
	routes: {
		books: 'books',
		commercialOffers:{
			url: 'books/{isbn}/commercialOffers',
			urlData: {
				isbn: function(data) {
					return (isArray(data) ? data : [data]).join(',');
				}
			}
		}
	}
}