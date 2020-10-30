import { ADD_FAVORITE, REMOVE_FAVORITE } from "../constants";

 export interface Message {
   [key: string]: any;
 }

 export interface Action {
   type: string;
   payload: Message;
 }

 const initialState: Message[] = [];

 export const favorites = (state: Message[] = initialState, action: Action) => {
   let newState = [...state];
   switch (action.type) {
     case ADD_FAVORITE:
       let addIndex = newState.findIndex(
         (ele) => ele.date === action.payload.date
       );
       if (addIndex === -1){
         newState.push(action.payload);
       }
       return newState;
     case REMOVE_FAVORITE:
       let deleteIndex = newState.findIndex(
         (ele) => ele.date === action.payload.date
       );
       newState.splice(deleteIndex, 1);
       return newState;
     default:
       return state;
   }
 };
