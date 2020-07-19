import React, { FC } from "react";
import { render } from "react-dom";
import { Root } from "./App";

const mainElement = document.getElementById("app");
const renderApp = (Root: FC) => render(<Root />, mainElement);
renderApp(Root);

// @ts-ignore
if (module.hot) module.hot.accept(() => renderApp(require("./App").Root));
