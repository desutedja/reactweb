import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import auth from './features/auth/slice';
import building, { startAsync, stopAsync } from './features/building/slice';

const logger = createLogger({
  predicate: (getState, action) => 
  action.type !== startAsync.type &&
  action.type !== stopAsync.type
})

const reducers = combineReducers({
  auth,
  building
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