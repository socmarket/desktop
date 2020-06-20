import React, { Fragment } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "semantic-ui-css/semantic.css";

import getStore from "./store/store";
import StartPage from "./page/start";
import ErrorPage from "./page/error";

import "./i18n";

import { ipcRenderer } from "electron";

getStore()
  .then(store => {
    ReactDom.render(
      <Provider store={store}>
        <StartPage />
      </Provider>,
      document.getElementById("root")
    );
  })
  .catch(err => {
    ReactDom.render(
      <ErrorPage error={err} />,
      document.getElementById("root")
    );
  })
;
