import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import auth, { startAsync, stopAsync }  from './features/auth/slice';
import management from './features/management/slice';
import building from './features/building/slice';
import resident from './features/resident/slice';
import staff from './features/staff/slice';
import task from './features/task/slice';
import ads from './features/ads/slice';

const logger = createLogger({
  predicate: (getState, action) => 
  action.type !== startAsync.type &&
  action.type !== stopAsync.type
})

const reducers = combineReducers({
  auth,
  management,
  building,
  resident,
  staff,
  task,
  ads,
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, logger]
});

export const persistor = persistStore(store);