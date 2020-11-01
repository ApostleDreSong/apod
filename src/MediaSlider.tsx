import { Button, Container, Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { connect } from "react-redux";
import {
  addFavorite,
  removeFavorite
} from "./store/actions/favorite";
import FavoritesComponent from "./FavoritesComponent";
import { saveToLocalStorage } from "./saveToLocalStorage";
import { Dispatch } from "./store/index";
import { RootState } from "./store/reducers/index";

const ApiKey = process.env.REACT_APP_APIKEY;

const formatter = (d: Date) => {
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const today = new Date();
const todayDate = formatter(today);

interface GeneralObject {
  [key: string]: any
}

const MediaSlider: React.FunctionComponent<GeneralObject> = (props) => {
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [errorfetching, setErrorFetching] = useState(false);
  const [podRes, setPodRes] = useState<GeneralObject>({});
  const [showFav, setShowFav] = useState(false);
  const [yesterdaysPreview, setYesterdaysPreview] = useState<GeneralObject>({});
  const [tomorrowsPreview, setTomorrowsPreview] = useState<GeneralObject>({});
  const [ydayErr, setYdayErr] = useState(false);
  const [tmrErr, setTmrErr] = useState(false);

  useEffect(() => {
    props.updateFromFirestore();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(
          `https://api.nasa.gov/planetary/apod?date=${selectedDate}&hd=false&api_key=${ApiKey}`
        )
        .then((res) => {
          saveToLocalStorage(res.data);
          setPodRes(res.data);
          setErrorFetching(false);
        })
        .catch((err) => {
          setPodRes({});
          setErrorFetching(true);
        });
    }
  }, [selectedDate]);

  useEffect(() => {
    ///Get preview for previous day
    let yday = new Date(+selectedDay);
    yday.setDate(yday.getDate() - 1);
    let yesterday = formatter(yday);

    axios
      .get(
        `https://api.nasa.gov/planetary/apod?date=${yesterday}&hd=false&api_key=${ApiKey}`
      )
      .then((res) => {
        setYesterdaysPreview(res.data);
        setYdayErr(false);
      })
      .catch((err) => {
        setYdayErr(true);
      });

    ///Get preview for next day
    let tm = new Date(+selectedDay);
    tm.setDate(tm.getDate() + 1);
    let tmr = formatter(tm);

    axios
      .get(
        `https://api.nasa.gov/planetary/apod?date=${tmr}&hd=false&api_key=${ApiKey}`
      )
      .then((res) => {
        setTomorrowsPreview(res.data);
        setTmrErr(false);
      })
      .catch((err) => {
        setTmrErr(true);
      });
  }, [selectedDay]);

  const previousDay = () => {
    //calculating yesterdays date
    var d = new Date(+selectedDay);
    d.setDate(d.getDate() - 1);
    setSelectedDay(d);
    createDate(d);
  };

  const nextDay = () => {
    //calculating tomorrow's date
    var d = new Date(+selectedDay);
    d.setDate(d.getDate() + 1);
    if (d <= today) {
      setSelectedDay(d);
      createDate(d);
    }
  };

  const createDate = (d: Date) => {
    const date = formatter(d);
    setSelectedDate(date);
  };

  const changeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let convertedDate = new Date(e.target.value);
    setSelectedDay(convertedDate);
    setSelectedDate(e.target.value);
  };

  const addToFav = () => {
    props.addFav(podRes);
  };

  const viewFavorites = () => {
    setShowFav(true);
  };

  const closeModal = () => {
    setShowFav(false);
  };

  const removeFromFav = () => {
    props.removeFav(podRes.date);
  };

  return (
    <Container>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        {podRes && podRes.title}
      </h2>
      <Grid container alignItems="center" justify="space-between">
        <Grid
          item
          sm={3}
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => previousDay()}
        >
          <ArrowBackIcon fontSize="large" />
          <p>Prev Day</p>
          {ydayErr ? (
            <div
              style={{
                height: "50px",
                width: "100%",
                textAlign: "center",
              }}
            >
              No picture Yesterday
            </div>
          ) : (
            <img
              src={yesterdaysPreview.url}
              alt={yesterdaysPreview.title}
              width="50px"
              height="50px"
            />
          )}
        </Grid>
        <Grid
          item
          sm={6}
          style={{
            overflow: "hidden",
            height: "500px",
            border: errorfetching ? "1px solid black" : "none",
          }}
        >
          {errorfetching ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Oops! No image today
            </div>
          ) : (
            <img width="100%" src={podRes && podRes.url} />
          )}
        </Grid>
        <Grid
          item
          sm={3}
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => nextDay()}
        >
          <ArrowForwardIcon fontSize="large" />
          <p>Next Day</p>
          {tmrErr ? (
            <div
              style={{
                height: "50px",
                width: "100%",
                textAlign: "center",
              }}
            >
              No picture Tomorrow
            </div>
          ) : (
            <img
              src={tomorrowsPreview.url}
              alt={tomorrowsPreview.title}
              width="50px"
              height="50px"
            />
          )}
        </Grid>
      </Grid>
      <Grid container justify="center" style={{ marginTop: "20px" }}>
        <Grid item container justify="space-between" md={6}>
          {!errorfetching ? (
            <Grid item>
              <Button
                variant={
                  podRes &&
                    props.favorites.some((ele: GeneralObject) => ele.date === podRes.date)
                    ? "contained"
                    : "outlined"
                }
                style={{
                  backgroundColor:
                    podRes &&
                      props.favorites.some((ele: GeneralObject) => ele.date === podRes.date)
                      ? "#0000FF"
                      : "white",
                  color:
                    podRes &&
                      props.favorites.some((ele: GeneralObject) => ele.date === podRes.date)
                      ? "white"
                      : "black",
                }}
                onClick={
                  podRes &&
                    props.favorites.some((ele: GeneralObject) => ele.date === podRes.date)
                    ? removeFromFav
                    : addToFav
                }
              >
                {podRes &&
                  props.favorites.some((ele: GeneralObject) => ele.date === podRes.date)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </Button>
            </Grid>
          ) : null}
          <Grid item>
            <Button variant="outlined" onClick={viewFavorites}>
              View Favorites
            </Button>
          </Grid>
          <Grid item>
            <TextField type="date" value={selectedDate} onChange={changeDate} />
          </Grid>
        </Grid>
      </Grid>
      <div
        style={{ textAlign: "center", lineHeight: "26px", margin: "20px 50px" }}
      >
        {podRes && podRes.explanation}
      </div>
      {showFav ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            overflow: "auto",
            backgroundColor: "#202020",
          }}
        >
          <FavoritesComponent closeModal={closeModal} />
        </div>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    addFav: (details: GeneralObject) => {
      dispatch(addFavorite(details));
    },
    removeFav: (date: string) => {
      dispatch(removeFavorite(date));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaSlider);
