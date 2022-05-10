import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import main from "./features/slice";
import auth, { startAsync, stopAsync } from "./features/auth/slice";
import dashboard from "./features/dashboard/slice";
import chat from "./features/chat/slice";

import management from "./features/slices/management";
import building from "./features/slices/building";
import resident from "./features/slices/resident";
import billing from "./features/slices/billing";
import staff from "./features/slices/staff";
import task from "./features/slices/task";
import merchant from "./features/slices/merchant";
import vouchers from "./features/slices/vouchers";
import product from "./features/slices/product";
import transaction from "./features/slices/transaction";
import ads from "./features/slices/ads";
import announcement from "./features/slices/announcement";
import admin from "./features/slices/admin";
import notification from "./features/slices/notification";
import requestpremium from "./features/slices/requestpremium";
import catatmeter from "./features/slices/catatmeter";
import internet from "./features/slices/internet";

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== startAsync.type && action.type !== stopAsync.type,
});

const reducers = combineReducers({
  main,
  auth,
  dashboard,
  management,
  building,
  resident,
  requestpremium,
  catatmeter,
  billing,
  staff,
  task,
  merchant,
  product,
  transaction,
  announcement,
  ads,
  chat,
  admin,
  notification,
  vouchers,
  internet,
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
