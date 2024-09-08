import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Review from "./pages/Review";
import LoginPage from "./pages/LoginPage";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Login from "./users/Login";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column">
        <div id="header">
          <div id="title">
            <h1>Food delivery</h1>
          </div>

          <Login />
        </div>
        <div className="d-flex flex-row">
          <Sidebar />

          <div className="content-container p-4">
            <Routes>
              <Route path="/Home" element={<Home />} />
              <Route path="/Order" element={<Order />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/Payment" element={<Payment />} />
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/Contact" element={<Contact />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
