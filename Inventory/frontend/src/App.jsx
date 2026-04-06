import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Your dashboard page
import ViewDetails from "./components/ViewDetails"; // The details page
import { ToastContainer } from "react-toastify";
import UpdateItem from "./components/UpdateItem";
import AddItem from "./components/AddItem";
const App = () => {
  return (
    <Router>
      <div>
      
            <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/details" element={<ViewDetails />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/update" element={<UpdateItem />} />      
      </Routes>
      </div>
    </Router>
  );
};

export default App;
