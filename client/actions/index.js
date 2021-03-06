import axios from 'axios';
import { INITIALIZE_PASSPORT, SUBMIT_PASSPORT } from './types';

// initializes nova's passport form upon message receive
// > country and public_key were passed in via `script` tag
export function initializePassport(message) {
	
	const public_key = message["key"];
	const country    = message["country"];
	const origin     = message["origin"];

	// handle ajax w/ redux-thunk
	const request = axios.get('/api/v1/passports/form', { params: { public_key, country, origin } });
	return (dispatch) => {
		request.then((res) => {
			dispatch({
				type: INITIALIZE_PASSPORT,
				payload: res.data
			});
		});
	}

}

// submit info to get your nova passport
export function submitPassport(data) {
	const request = axios.post('/api/v1/passports/form', data);
	return (dispatch) => {
		request.then((res) => {
			dispatch({
				type: SUBMIT_PASSPORT,
				payload: {
					...res.data,
					status: res.status
				}
			});
		});
	}

}