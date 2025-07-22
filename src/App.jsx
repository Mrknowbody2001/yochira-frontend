import React from "react";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    // <Routes>
    //   <Route path="/dashboard" element={<Dashboard />} />
    // </Routes>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* ← ADD THIS */}
    </Routes>
  );
};

export default App;
