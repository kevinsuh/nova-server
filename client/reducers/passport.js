import { INITIALIZE_PASSPORT, SUBMIT_PASSPORT } from '../actions/types';

const initialState = { origin: null, public_key: null, CountryId: null };

// this reducer holds initial passport data passed in
// via `script` tag. these are parameters needed to
// generate passport form in the first place
// - we pass this data along when we submit the form
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			const { data: { public_key, CountryId, origin } } = action.payload;
			return {
				...state,
				public_key,
				CountryId,
				origin
			};
		}
	}

	return state;

}