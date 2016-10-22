import { combineReducers } from 'redux';
import PassportReducer from './passport';
import PassportFormReducer from './passport_form';

const reducers = combineReducers({
  passport: PassportReducer,
  passportForm: PassportFormReducer
});

export default reducers;