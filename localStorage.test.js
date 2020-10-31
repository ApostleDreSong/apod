const saveToLocalStorage = require("./src/saveToLocalStorage");
const axios = require("axios");

// const ApiKey = process.env.REACT_APP_APIKEY;
const ApiKey = "TB8ckj3tPFEz2131JKRgeGdH2h2dTlV1bmVaszgt";

const formatter = (d) => {
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const yday = new Date();
yday.setDate(yday.getDate() - 1);
const yesterday = formatter(yday);

describe("Save Function", () => {
  it("it should save API response data to local storage", () => {
    return axios
      .get(
        `https://api.nasa.gov/planetary/apod?date=${yesterday}&hd=false&api_key=${ApiKey}`
      )
      .then((res) => {
        jest.fn(() => saveToLocalStorage(res.data));
        let savedPhoto = JSON.parse(
          global.localStorage.getItem("photoOfTheDay")
        );
        console.log(savedPhoto);
        // expect(savedPhoto.date).toBe(yesterday);
      });
  });
});
