import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { defaultRole } from "./settings";

import "./App.css";
import "./features/auth/styles.css";
import "./components/styles.css";
import "./components/input.css";
import "./components/table.css";
import NotFound from "./components/NotFound";

import Login from "./features/auth/Login";
import OTP from "./features/auth/OTP";

import Editor from "./features/roles/Editor";
import MerchantAcquisition from "./features/roles/MerchantAcquisition";
import Viewer from "./features/roles/Viewer";
import Finance from "./features/roles/Finance";
import BM from "./features/roles/BM";

import { store, persistor } from "./store";

function SA({ children, ...other }) {
  const { user } = useSelector((state) => state.auth);

  switch (user.group) {
    case 'merchant_acquisition': return <MerchantAcquisition />
    case 'viewer': return <Viewer />
    case 'finance': return <Finance />
    default: return <Editor />
  }
}

function MainRoute({ children, ...other }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { path } = other;

  return (
    <Route
      {...other}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: path + "/login",
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}

function OTPRoute({ children, ...other }) {
  const { email } = useSelector((state) => state.auth);

  const { path } = other;

  return (
    <Route
      {...other}
      render={({ location }) =>
        email ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: path + "/login",
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}

function AppRoute() {
  return (
    <Router>
      <div className="App scroller" id="App">
        <Switch>
          <Redirect exact from="/" to={"/" + defaultRole } />
          {/* superadmin routes */}
          { defaultRole === 'sa' && <Route path="/sa/login">
            <Login role="sa" />
          </Route>}
          { defaultRole === 'sa' && <OTPRoute path="/sa/otp">
            <OTP role="sa" />
          </OTPRoute>}
          { defaultRole === 'sa' && <MainRoute path="/sa">
             <SA />
          </MainRoute> }
          {/* bm routes */}
          { defaultRole === 'sa' && <Route path="/bm/login">
            <Login role="bm" />
          </Route>}
          { defaultRole === 'sa' && <OTPRoute path="/bm/otp">
            <OTP role="bm" />
          </OTPRoute>}
          { defaultRole === 'sa' && <MainRoute path="/bm">
            <BM />
          </MainRoute>}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>

  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoute />
      </PersistGate>
    </Provider>
  );
}

export default App;
