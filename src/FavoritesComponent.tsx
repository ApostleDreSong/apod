import { Button } from '@material-ui/core';
import React from 'react';
import { connect } from "react-redux";
import { removeFavorite } from "./store/actions/favorite";
import {RootState} from "./store/reducers/index";
import {Dispatch} from "./store/index"

interface Props {
    [key: string]: any
}

function FavoritesComponent(props: Props) {

    const closeMe = () => {
      props.closeModal();
    };

    return (
      <div>
        <Button onClick={()=>closeMe()}>Close</Button>
        <div>You go see your favorites here</div>
      </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesComponent);