import { INITIALIZE_PASSPORT, SUBMIT_PASSPORT } from '../actions/types';

const initialState = { origin: null, public_key: null, CountryId: null, response: { public_token: null, message: null, status: null } };
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
		case SUBMIT_PASSPORT: {
			const { public_token, message, status } = action.payload;
			return {
				...state,
				response: {
					public_token,
					message,
					status
				}
			}
		}
	}

	return state;

}