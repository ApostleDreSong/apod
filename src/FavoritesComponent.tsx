import { Button, Container, Grid, MenuItem, Select } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { removeFavorite, removeAllFavorite } from "./store/actions/favorite";
import { RootState } from "./store/reducers/index";
import { Dispatch } from "./store/index";
import CloseIcon from "./assets/close.svg";
import { ApodObject } from "./store/reducers/favorite"

const styles = {
  close: {
    cursor: "pointer",
    color: "white",
    width: "100%",
    marginBottom: "30px",
    marginTop: "30px"
  },
  select: {
    backgroundColor: 'white',
    borderRadius: '4px',
    width: '150px',
    marginBottom: '20px',
  },
  main: {
    color: "white"
  }
}

interface Props {
  [key: string]: any
}

interface Ele {
  date: string
}

function FavoritesComponent(props: Props) {
  const [selectedFav, setSelectedFav] = useState<unknown>("");
  // const [allFavs, setAllFavs] = useState<{ [key: string]: any }[]>([]);
  const [details, setDetails] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    if (selectedFav !== "") {
      let chosen = props.favorites.find((ele: Ele) => ele.date === selectedFav);
      setDetails(chosen)
    }
  }, [selectedFav])

  useEffect(() => {
    if (props.favorites.length > 0) {
      setSelectedFav(props.favorites[0].date)
    }
  }, [props.favorites])

  const closeMe = () => {
    props.closeModal();
  };

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSelectedFav(event.target.value)
  };

  const deleteFav = (date: string) => {
    props.removeFav(date);
    setSelectedFav("");
    setDetails({});
  }

  const deleteAllFav = () => {
    props.removeAllFav();
    setSelectedFav("");
    setDetails({});
  }

  return (
    <Container style={styles.main}>
      <Grid container justify="flex-end" alignItems="center" onClick={() => closeMe()} style={styles.close}>
        <Grid item>Close</Grid>
        <Grid item>
          <img src={CloseIcon} />
        </Grid>
      </Grid>
      <div>
        <p>Select From Favorites</p>
        <Select
          style={styles.select}
          value={selectedFav}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
          </MenuItem>
          {
            props.favorites.map((each: ApodObject, index: number) => (
              <MenuItem key={index} value={each.date}>{`${each.date} - ${each.title}`}</MenuItem>
            ))
          }
        </Select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h3>{details.title}</h3>
        <h4>{details.date}</h4>
        <img src={details.url} alt={details.title} />
        <p>{details.explanation}</p>
      </div>
      {
        selectedFav !== "" ?
          <Button onClick={() => deleteFav(details.date)} variant="outlined" style={{ color: "white", marginRight: "5px", borderColor: "white" }}>Delete this image from favorites</Button>
          : null
      }
      {
        props.favorites.length > 0 ?
          <Button onClick={deleteAllFav} variant="contained" >Delete All Favorites</Button>
          : null
      }
    </Container>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeFav: (date: string) => {
      dispatch(removeFavorite(date));
    },
    removeAllFav: () => {
      dispatch(removeAllFavorite())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesComponent);