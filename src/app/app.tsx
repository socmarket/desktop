import React, { Fragment } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import "semantic-ui-css/semantic.min.css"

import HomePage from "./page/home";
import Store from "./store/store";

ReactDom.render(
  <Provider store={Store}>
    <HomePage />
  </Provider>,
  document.getElementById("root")
);
