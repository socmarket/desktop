import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

let render = () => {
  ReactDom.render(
    <p>Hello, world!</p>,
    document.getElementById("root")
  );
}

if (process.env.NODE_ENV === "development") {
  const runtime = require("react-refresh/runtime");
  runtime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = (type, id) => {};
  window.$RefreshSig$ = () => type => type;
  render();
} else {
  render();
}
