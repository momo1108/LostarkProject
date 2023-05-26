import { Action, createActions, handleActions } from "redux-actions";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  CharData,
  RootState,
  SearchedData,
  SearchedState,
} from "../../types/ReducerType";

const initialState: SearchedState = {
  data: [],
  loading: false,
  error: null,
};

const prefix = "loaple/searched";

export const { pending, success, fail } = createActions(
  "PENDING",
  "SUCCESS",
  "FAIL",
  { prefix }
);

// generic 설정 <State, Payload>
const reducer = handleActions<SearchedState, SearchedData[]>(
  {
    PENDING: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => ({
      data: action.payload,
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

export const { save, init } = createActions("SAVE", "INIT", { prefix });

function checker(state: SearchedData[], data: CharData): SearchedData[] {
  if (!data.ArmoryProfile) return [];
  let duplicate: boolean = false;
  const level = parseInt(data.ArmoryProfile.ItemAvgLevel.replace(",", ""));

  const tmp = state.map((e: SearchedData) => {
    if (e.name === data.ArmoryProfile.CharacterName) {
      duplicate = true;
      return {
        ...e,
        level,
      };
    } else return e;
  });
  return duplicate
    ? tmp
    : [
        ...tmp,
        {
          name: data.ArmoryProfile.CharacterName,
          level,
          class: data.ArmoryProfile.CharacterClassName,
          img: data.ArmoryProfile.CharacterImage,
          like: false,
          server: data.ArmoryProfile.ServerName,
        },
      ];
}

function* saveSaga(action: Action<CharData>): any {
  try {
    yield put(pending());
    const _state: SearchedData[] = yield select(
      (state: RootState) => state.searched.data
    );
    const data = yield call(checker, _state, action.payload);
    yield put(success(data));
  } catch (error: any) {
    yield put(fail(error));
  }
}

function* initSaga(action: Action<SearchedData[]>): any {
  try {
    yield put(pending());
    yield put(success(action.payload));
  } catch (error: any) {
    yield put(fail(error));
  }
}

export function* searchedSaga() {
  yield takeEvery(`${prefix}/SAVE`, saveSaga);
  yield takeEvery(`${prefix}/INIT`, initSaga);
}
