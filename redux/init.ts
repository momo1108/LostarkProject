import { applyMiddleware, compose, legacy_createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./modules/reducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./modules/rootSaga";
import { createWrapper } from "next-redux-wrapper";

const isProduction = process.env.NODE_ENV === "production";

const initStore = () => {
  // 사이트 접속 시 localStorage - Redux Storage 동기화
  // const token = TokenService.get();

  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = isProduction
    ? compose
    : composeWithDevTools({ trace: true, traceLimit: 25 });

  const store = legacy_createStore(
    reducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(initStore, { debug: !isProduction });

export default wrapper;
