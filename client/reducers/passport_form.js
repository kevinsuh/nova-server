import { INITIALIZE_PASSPORT } from '../actions/types';

const initialState = [];
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			const { form } = action.payload;
			return form;
		}
	}

	return state;

}