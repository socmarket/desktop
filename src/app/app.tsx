import React, { Fragment } from "react";
import ReactDom from "react-dom";
import { Provider } from "react-redux";

import "semantic-ui-css/semantic.min.css"

import Store from "./store/store";
import StartPage from "./page/start";

ReactDom.render(
  <Provider store={Store}>
    <StartPage />
  </Provider>,
  document.getElementById("root")
);
