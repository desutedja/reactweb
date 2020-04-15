import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'
import { Provider, useSelector } from 'react-redux';

import './App.css';
import Login from './features/auth/login';
import Menu from './features/main/menu';
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
              <MainRoute path="/">
                <Menu />
              </MainRoute>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
