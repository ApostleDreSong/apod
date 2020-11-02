const axios = require("axios");
require("dotenv").config();
const { saveToLocalStorage } = require("./src/saveToLocalStorage");

const ApiKey = process.env.REACT_APP_APIKEY;

const date = "2020-10-31";

const localStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

describe("App", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
  });

  it("Data in localStorage for 'Photo of the day' should equal api response", async () => {
    let call = () => {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `https://api.nasa.gov/planetary/apod?date=${date}&hd=false&api_key=${ApiKey}`
          )
          .then((res) => {
            resolve(res.data);
          });
      });
    };
    let apiCall = await call();
    saveToLocalStorage(apiCall);
    let getSavedItem = window.localStorage.getItem("photoOfTheDay");
    let parsedResult = JSON.parse(getSavedItem);
    expect(parsedResult).toEqual(apiCall);
  });
});
