import { combineReducers } from 'redux';
import { favorites } from "./favorite";

export const rootReducer = combineReducers({
  favorites,
});