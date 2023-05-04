import { Action, createActions, handleActions } from "redux-actions";
import { call, put, takeEvery } from "redux-saga/effects";
import { CharData, CharState } from "../../types/ReducerType";
import CharacterService from "@/service/CharacterService";
import { NextRouter } from "next/router";

const initialState: CharState = {
  data: { data: {}, name: "" },
  names: [],
  loading: false,
  error: null,
};

const prefix = "loaple/character";

export const { pending, success, fail } = createActions(
  "PENDING",
  "SUCCESS",
  "FAIL",
  { prefix }
);

// generic 설정 <State, Payload>
const reducer = handleActions<CharState, CharData>(
  {
    PENDING: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => ({
      data: action.payload.data,
      names: state.names.includes(action.payload.name)
        ? state.names
        : [...state.names, action.payload.name],
      loading: false,
      error: null,
    }),
    // payload를 string으로 지정해놔서 error에 사용하는 경우
    // action 타입을 any로 지정해야 타입에러없이 가능.
    FAIL: (state, action: any) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  { prefix }
);

export default reducer;

// SAGA
export const { getChar } = createActions("GET_CHAR", { prefix });

function* getCharSaga(action: Action<string>) {
  try {
    yield put(pending());
    const data: Object = yield call(
      CharacterService.getCharacterSummary,
      action.payload
    );
    yield put(success({ data, name: action.payload }));
  } catch (error: any) {
    yield put(fail(error));
  }
}

export function* charSaga() {
  yield takeEvery(`${prefix}/GET_CHAR`, getCharSaga);
}
