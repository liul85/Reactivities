import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import "mobx-react-lite/batchingForReactDom";
import { Router } from "react-router-dom";
import ScrollTop from "./app/layout/ScrollTop";
import { createBrowserHistory } from "history";
import dateFnsLocalizer from "react-widgets-date-fns";

dateFnsLocalizer();

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollTop>
      <App />
    </ScrollTop>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
