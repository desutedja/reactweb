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
import OTP from "./features/auth/OTP";
import SARoutes from "./routes/SA";
import BMRoutes from "./routes/BM";
import { store, persistor } from "./store";

function SAMain({ children, ...other }) {
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
                pathname: "/sa/login",
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}

function BMMain({ children, ...other }) {
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
                pathname: "/bm/login",
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
              <Redirect exact from="/" to={"/sa"} />
              {/* superadmin routes */}
              <Route path="/sa/login">
                <Login role="sa" />
              </Route>
              <Route path="/sa/otp">
                <OTP role="sa" />
              </Route>
              <SAMain path="/sa">
                <SARoutes />
              </SAMain>
              {/* bm routes */}
              <Route path="/bm/login">
                <Login role="bm" />
              </Route>
              <Route path="/bm/otp">
                <OTP role="bm" />
              </Route>
              <BMMain path="/bm">
                <BMRoutes />
              </BMMain>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
