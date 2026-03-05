import { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Admin from "./pages/Admin";
import Entry from "./pages/Entry";

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/entry" element={<Entry />} />
      </Routes>
    </Router>
  );
}

export default App;