import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { createMemoryRouter } from "react-router-dom";

import "./App.css";
import "./index.css";

import App from "./App.jsx";
import Payment from "./components/payment.jsx";
import Notepad from "./components/notepad.jsx";
import Home from "./components/home.jsx";

const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: "/payment", element: <Payment /> },
        { path: "/notepad", element: <Notepad /> },
      ],
    },
  ],
  {
    initialEntries: ["/"], 
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
