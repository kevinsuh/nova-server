import { INITIALIZE_PASSPORT } from '../actions/types';

const initialState = { form: null };
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			return { ...state,
				form: action.payload
			};
		}
	}

	return state;

}