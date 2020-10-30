import { Button, Container, Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import axios from "axios";

const ApiKey = "TB8ckj3tPFEz2131JKRgeGdH2h2dTlV1bmVaszgt";

export default function MediaSlider() {
  const [selectedDay, setSelectedDay] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [errorfetching, setErrorFetching] = useState(false);
  const [podRes, setPodRes] = useState({});

  useEffect(() => {
    const today = new Date();
    setSelectedDay(today);
    createDate(today);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      axios
        .get(
          `https://api.nasa.gov/planetary/apod?date=${selectedDate}&hd=false&api_key=${ApiKey}`
        )
        .then((res) => {
          console.log(res.data);
          setPodRes(res.data);
          setErrorFetching(false);
        })
        .catch((err) => {
          setPodRes({});
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
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    setSelectedDate(date);
  };

  const changeDate = (e) => {
    var convertedDate = new Date(e.target.value);
    setSelectedDay(convertedDate);
    createDate(convertedDate);
  };

  return (
    <Container>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        {podRes.title}
      </h2>
      <Grid container alignItems="center" justify="space-between">
        <Grid
          item
          md={3}
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => mediaLeft()}
        >
          <ArrowBackIcon fontSize="large" />
          <p>Prev Day</p>
        </Grid>
        <Grid
          item
          md={6}
          style={{
            overflow: "hidden",
            height: "500px",
            border: errorfetching?"1px solid black":"none",
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
            <img width="100%" src={podRes.url} />
          )}
        </Grid>
        <Grid
          item
          md={3}
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
            <Button variant="outlined">Set Favorite</Button>
          </Grid>
          <Grid item>
            <TextField type="date" value={selectedDate} onChange={changeDate} />
          </Grid>
        </Grid>
      </Grid>
      <div
        style={{ textAlign: "center", lineHeight: "26px", margin: "20px 50px" }}
      >
        {podRes.explanation}
      </div>
    </Container>
  );
}
