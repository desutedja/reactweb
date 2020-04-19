import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'
import { Provider, useSelector } from 'react-redux';

import './App.css';
import './features/auth/styles.css';
import './components/styles.css';
import './components/input.css';

import Login from './features/auth/Login';
import OTP from './features/auth/OTP';
import Home from './Home';
import {store, persistor} from './store';

function MainRoute({ children, ...other }) {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Route
      {...other}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          )}
    />
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/otp">
                <OTP />
              </Route>
              <MainRoute path="/">
                <Home />
              </MainRoute>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
