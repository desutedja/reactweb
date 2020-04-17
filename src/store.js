import {configureStore, combineReducers} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import auth from './features/auth/slice';

const reducers = combineReducers({
  auth
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