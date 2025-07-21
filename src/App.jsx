import React from "react";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />  
    </Routes>
  );
};

export default App;
