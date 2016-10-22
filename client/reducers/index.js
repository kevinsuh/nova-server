import { combineReducers } from 'redux';
import PassportReducer from './passport';

const reducers = combineReducers({
  passport: PassportReducer
});

export default reducers;