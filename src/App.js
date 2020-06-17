import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";

import "./App.css";
import "./features/auth/styles.css";
import "./components/styles.css";
import "./components/input.css";
import "./components/table.css";

import Login from "./features/auth/Login";
import LoginBM from "./features/auth/LoginBM";

import OTP from "./features/auth/OTP";
import OTPBM from "./features/auth/OTPBM";


import Home from "./Home";
import { store, persistor } from "./store";
function MainRoute({ children, ...other }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...other}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App" id="App">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/loginbm">
                <LoginBM />
              </Route>
              <Route path="/otp">
                <OTP />
              </Route>
              <Route path="/otpbm">
                <OTPBM />
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
