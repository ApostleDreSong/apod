import { Button, Container, Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";
import { connect } from "react-redux";
import { addFavorite } from "./store/actions/favorite";
import FavoritesComponent from "./FavoritesComponent";

const ApiKey = process.env.REACT_APP_APIKEY;

const formatter = (d) => {
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
};

const today = new Date();
const todayDate = formatter(today);

const MediaSlider = (props) => {
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [errorfetching, setErrorFetching] = useState(false);
  const [podRes, setPodRes] = useState();
  const [showFav, setShowFav] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(
          `https://api.nasa.gov/planetary/apod?date=${selectedDate}&hd=false&api_key=${ApiKey}`
        )
        .then((res) => {
          setPodRes(res.data);
          setErrorFetching(false);
        })
        .catch((err) => {
          setPodRes();
          setErrorFetching(true);
        });
    }
  }, [selectedDate]);

  const mediaLeft = () => {
    //calculating yesterdays date
    var d = selectedDay;
    d.setDate(d.getDate() - 1);
    createDate(d);
  };

  const mediaRight = () => {
    //calculating tomorrow's date
    var d = selectedDay;
    d.setDate(d.getDate() + 1);
    createDate(d);
  };

  const createDate = (d) => {
    const date = formatter(d);
    setSelectedDate(date);
  };

  const changeDate = (e) => {
    var convertedDate = new Date(e.target.value);
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
          onClick={() => mediaLeft()}
        >
          <ArrowBackIcon fontSize="large" />
          <p>Prev Day</p>
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
          onClick={() => mediaRight()}
        >
          <ArrowForwardIcon fontSize="large" />
          <p>Next Day</p>
        </Grid>
      </Grid>
      <Grid container justify="center" style={{ marginTop: "20px" }}>
        <Grid item container justify="space-between" md={6}>
          <Grid item>
            <Button
              variant={
                props.favorites.some((ele) => ele.date === podRes.date)
                  ? "contained"
                  : "outlined"
              }
              style={{
                backgroundColor: props.favorites.some(
                  (ele) => ele.date === podRes.date
                )
                  ? "#0000FF"
                  : "white",
                color: props.favorites.some((ele) => ele.date === podRes.date)
                  ? "white"
                  : "black",
              }}
              onClick={addToFav}
            >
              Set Favorite
            </Button>
          </Grid>
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
            minHeight: "100vh",
            backgroundColor: '#202020',
          }}
        >
          <FavoritesComponent closeModal={closeModal} />
        </div>
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addFav: (details) => {
      dispatch(addFavorite(details));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaSlider);
