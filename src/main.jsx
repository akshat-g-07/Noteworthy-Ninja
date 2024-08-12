import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import "./App.css";
import "./index.css";

import App from "./App.jsx";
import Home from "./components/home.jsx";
import Auth from "./components/auth.jsx";
import Payment from "./components/payment.jsx";
import Notepad from "./components/notepad.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/auth", element: <Auth /> },
      { path: "/payment", element: <Payment /> },
      { path: "/notepad", element: <Notepad /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
