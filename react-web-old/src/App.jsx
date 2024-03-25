import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/login";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }
}

export default App;
