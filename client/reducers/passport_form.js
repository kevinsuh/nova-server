import { INITIALIZE_PASSPORT, SUBMIT_PASSPORT } from '../actions/types';

const initialState = { fields: [], response: { public_token: null, message: null, status: null } } ;

// this reducer does 2 things:
// > 1) gathers form fields from backend to generate country-specific form
// > 2) returns form response, incl. `200` status and `message` to send back to lender
export default function(state = initialState, action) {
	switch (action.type) {
		case INITIALIZE_PASSPORT: {
			const { form } = action.payload;
			return {
				...state,
				fields: form
			}
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