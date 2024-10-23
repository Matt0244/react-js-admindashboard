// /app index/
// vs code rcc short cut

import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Admin from "./pages/admin/admin.jsx";
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";
import { ConfigProvider } from "antd";
import "./index.css";

export default function App() {
  const user = storageUtils.getUser();
  memoryUtils.user = user;

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3C6E71",
          },
        }}
      >
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </ConfigProvider>
    </BrowserRouter>
  );
}
