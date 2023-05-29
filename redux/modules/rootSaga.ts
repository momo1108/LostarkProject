import { all } from "redux-saga/effects";
import { charSaga } from "./character";
// import { searchedSaga } from "./searched";

export default function* rootSaga() {
  // yield all([charSaga(), searchedSaga()]);
  yield all([charSaga()]);
}
