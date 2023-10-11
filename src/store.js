import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import main from "./features/slice";
import auth, { startAsync, stopAsync } from "./features/auth/slice";
import dashboard from "./features/dashboard/slice";
import billing from "./features/slices/billing";


const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== startAsync.type && action.type !== stopAsync.type,
});

const reducers = combineReducers({
  main,
  auth,
  dashboard,
  billing,
});

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === "auth/logout") {
    state = undefined;
  }

  return reducers(state, action);
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

let middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: middleware,
});

export const persistor = persistStore(store);
