import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import UserContentProvider from "./contexts/UserContentProvider";
import {BrowserRouter} from 'react-router-dom'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <UserContentProvider>
        <App />
      </UserContentProvider>
    </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);
