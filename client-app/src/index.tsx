import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/style.css";
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import "mobx-react-lite/batchingForReactDom";
import { BrowserRouter } from "react-router-dom";
import ScrollTop from "./app/layout/ScrollTop";

ReactDOM.render(
  <BrowserRouter>
    <ScrollTop>
      <App />
    </ScrollTop>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
