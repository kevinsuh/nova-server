import { INITIALIZE_PASSPORT } from '../actions/types';

const initialState = { form: null, data: {} };
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			return { ...state,
				data: action.payload
			};
		}
	}

	return state;

}