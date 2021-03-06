import React from "react";
import { render } from "react-dom";
import Router from "./routes";

const rootEl = document.getElementById("app");

render(<Router />, rootEl);

if (module.hot) {
  module.hot.accept();
}
