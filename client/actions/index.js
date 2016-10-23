import axios from 'axios';
import { INITIALIZE_PASSPORT, SUBMIT_PASSPORT } from './types';

export function initializePassport(message) {
	
	const public_key = message["key"];
	const country    = message["country"];
	const env        = message["env"];

	// handle ajax w/ redux-thunk
	const request = axios.get('/api/v1/passports/form', { params: { public_key, country, env } });
	return (dispatch) => {
		request.then((res) => {
			dispatch({
				type: INITIALIZE_PASSPORT,
				payload: res.data
			});
		});
	}

}

// submit personal data to get your nova passport
export function submitPassport(data) {

	const request = axios.post('/api/v1/passports/form', data);
	return (dispatch) => {
		request.then((res) => {
			console.log(`\n\n successful submit`);
			console.log(res.data);
			dispatch({
				type: SUBMIT_PASSPORT,
				payload: res.data
			});
		});
	}

}