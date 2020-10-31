import {
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  REMOVE_ALL_FAVORITE,
  UPDATE_FROM_FIRESTORE
} from "../constants";

import firebase from "firebase";
// Required for side-effects
import 'firebase/firestore';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API,
  authDomain: "apod-12d5f.firebaseapp.com",
  databaseURL: "https://apod-12d5f.firebaseio.com",
  projectId: "apod-12d5f",
  storageBucket: "apod-12d5f.appspot.com",
  messagingSenderId: "70056382948",
  appId: "1:70056382948:web:bd54d74a13798b78c377f1",
});

const db = firebase.firestore();

const favoritesColl = db.collection("favorites");

export interface ApodObject {
  [key: string]: any;
}

export interface Action {
  type: string;
  payload: ApodObject;
}

const initialState: ApodObject[] = [];

///Get All Favorites
favoritesColl.get().then(res => {
  res.docs.map(doc => {
    initialState.push(doc.data())
  })
});

export const favorites = (state: ApodObject[] = initialState, action: Action) => {
  let newState = [...state];
  switch (action.type) {
    case ADD_FAVORITE:
      let addIndex = newState.findIndex(
        (ele) => ele.date === action.payload.date
      );
      if (addIndex === -1) {
        newState.push(action.payload);
        favoritesColl.add(action.payload);
      }
      return newState;
    case REMOVE_FAVORITE:
      let deleteIndex = newState.findIndex(
        (ele) => ele.date === action.payload.date
      );
      if (deleteIndex !== -1) {
        newState.splice(deleteIndex, 1);
        favoritesColl.where("date", "==", action.payload.date)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              // doc.data() is never undefined for query doc snapshots
              favoritesColl.doc(doc.id).delete()
            });
          })
      }
      return newState;
    case REMOVE_ALL_FAVORITE:
      newState = [];
      favoritesColl
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            favoritesColl.doc(doc.id).delete()
          });
        })
      return newState;
    default:
      return state;
  }
};
