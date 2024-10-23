/*
Function to generate and return a new state based on the old state and the specified action
*/
import { combineReducers } from "redux";

/*
Reducer function to manage the header title
*/
import storageUtils from "../utils/storageUtils";
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
} from "./action-types";

const initHeadTitle = "Home";

function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data;
    default:
      return state;
  }
}

/*
Reducer function to manage the currently logged-in user
*/
const initUser = storageUtils.getUser();

function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.user;
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg;
      // Do not modify the original state data directly
      // state.errorMsg = errorMsg
      return { ...state, errorMsg };
    case RESET_USER:
      return {};
    default:
      return state;
  }
}

/*
The default export is the combined reducer function
The structure of the managed total state:
  {
    headTitle: 'Home',
    user: {}
  }
*/
export default combineReducers({
  headTitle,
  user,
});
