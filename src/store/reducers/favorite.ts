import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  REMOVE_ALL_FAVORITE,
} from "../constants";

export interface ApodObject {
  [key: string]: any;
}

export interface Action {
  type: string;
  payload: ApodObject;
}

const initialState: ApodObject[] = [];

export const favorites = (state: ApodObject[] = initialState, action: Action) => {
  let newState = [...state];
  switch (action.type) {
    case ADD_FAVORITE:
      let addIndex = newState.findIndex(
        (ele) => ele.date === action.payload.date
      );
      if (addIndex === -1) {
        newState.push(action.payload);
      }
      return newState;
    case REMOVE_FAVORITE:
      let deleteIndex = newState.findIndex(
        (ele) => ele.date === action.payload.date
      );
      newState.splice(deleteIndex, 1);
      return newState;
    case REMOVE_ALL_FAVORITE:
      newState = [];
      return newState;
    default:
      return state;
  }
};
