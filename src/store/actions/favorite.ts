import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  REMOVE_ALL_FAVORITE,
} from "../constants";

export interface Obj {
  [key: string]: any
}

export const addFavorite = (payload: Obj) => {
  return {
    type: ADD_FAVORITE,
    payload,
  };
};

export const removeFavorite = (date: string) => {
  return {
    type: REMOVE_FAVORITE,
    payload: {
      date
    },
  };
};

export const removeAllFavorite = () => {
  return {
    type: REMOVE_ALL_FAVORITE,
    payload: {}
  };
};
