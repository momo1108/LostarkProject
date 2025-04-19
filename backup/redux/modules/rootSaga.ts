import { all } from "redux-saga/effects";
import { charSaga } from "./character";

export default function* rootSaga() {
  yield all([charSaga()]);
}
