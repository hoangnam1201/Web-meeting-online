import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import { myHistory } from "./routes/history";
import { Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router history={myHistory}>
      <App />
    </Router>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
