import axios from 'axios';
import { INITIALIZE_PASSPORT } from './types';

export function initializePassport(message) {
	return {
		type: INITIALIZE_PASSPORT,
		payload: message
	}

}