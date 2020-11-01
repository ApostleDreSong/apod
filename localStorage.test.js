const {saveToLocalStorage} = require("./src/saveToLocalStorage");
const axios = require("axios");
require("dotenv").config();

const ApiKey = process.env.REACT_APP_APIKEY;

const date = "2020-10-31";

describe("Save Function", () => {
  it("it should save API response data to local storage", () => {
    return axios
      .get(
        `https://api.nasa.gov/planetary/apod?date=${date}&hd=false&api_key=${ApiKey}`
      )
      .then((res) => {
        expect(saveToLocalStorage(res.data)).toBe("saved");
      });
  });
});
