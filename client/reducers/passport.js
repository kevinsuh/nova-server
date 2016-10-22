import { INITIALIZE_PASSPORT } from '../actions/types';

const initialState = { public_key: null, CountryId: null };
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			const { data: { public_key, CountryId } } = action.payload;
			return { ...state,
				public_key,
				CountryId
			};
		}
	}

	return state;

}