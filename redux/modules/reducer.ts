import { combineReducers } from "redux";
import character from "./character";
import searched from "./searched";

const reducer = combineReducers({
  character,
  searched,
});

export default reducer;
