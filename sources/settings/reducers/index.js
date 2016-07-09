/*
{
	products: {
			list: [
				{
					"isbn": "c8fabf68-8374-48fe-a7ea-a00ccd07afff",
					"title": "Henri Potier à l'école des sorciers",
					"price": 35,
					"cover": "http://henri-potier.xebia.fr/hp0.jpg"
				}
			],
			loading: {
				running: false,
				failed: false,
				errorMessage: ''
			}
		}
	],
	basket: {
		isbn:0,
		isbn:2,
		isbn:8
	}
}
*/

/*-----------------------------------*/

import { combineReducers } from 'redux'

function products(state = {
	list: [],
	loading: {
		running: false,
		failed: false,
		errorMessage: ''
	}
}, action) {
	switch (action.type) {
		case 'LOAD_PRODUCT_LIST':
			api.xebia.get.books().then(function (data) {
				action.dispatch({
					type: 'UPDATE_PRODUCT_LIST',
					products: data
				});
			}).catch(e => {
				action.dispatch({
					type: 'PRODUCT_LIST_LOADING_ERROR',
					message: e.message
				});
			});

			return {
				list: [],
				loading: {
					running: true,
					failed: false,
					errorMessage: ''
				}
			};

		case 'UPDATE_PRODUCT_LIST':
			return {
				list: action.products,
				loading: {
					running: false,
					failed: false,
					errorMessage: ''
				}
			};

		case 'PRODUCT_LIST_LOADING_ERROR':
			return {
				list: [],
				loading: {
					running: false,
					failed: true,
					errorMessage: action.message
				}
			};

		default:
			return state
	  }
}

function basket(state = {}, action) {
	switch (action.type) {
		case 'ADD_PRODUCT_TO_BASKET':
			let count = typeof state[action.isbn] === 'number' ? state[action.isbn] : 0;

			count++;

			let newState = {};
			newState[action.isnb] = count;

			return Object.assign({}, state, newState);

		default:
			return state
	}
}

const app = combineReducers({
  products,
  basket
});

export default app;