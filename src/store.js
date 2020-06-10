import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import auth, { startAsync, stopAsync }  from './features/auth/slice';
import dashboard from './features/dashboard/slice';
import management from './features/management/slice';
import building from './features/building/slice';
import building_management from './features/building_management/slice';
import resident from './features/resident/slice';
import billing from './features/billing/slice';
import staff from './features/staff/slice';
import task from './features/task/slice';
import merchant from './features/merchant/slice';
import product from './features/product/slice';
import transaction from './features/transaction/slice';
import ads from './features/ads/slice';
import announcement from './features/announcement/slice';
import chat from './features/chat/slice';

const logger = createLogger({
  predicate: (getState, action) => 
  action.type !== startAsync.type &&
  action.type !== stopAsync.type
})

const reducers = combineReducers({
  auth,
  dashboard,
  management,
  building,
  building_management,
  resident,
  billing,
  staff,
  task,
  merchant,
  product,
  transaction,
  announcement,
  ads,
  chat,
});

const persistConfig = {
  key: 'root',
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

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, logger]
});

export const persistor = persistStore(store);