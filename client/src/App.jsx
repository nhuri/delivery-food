import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Review from "./pages/Review";
import LoginPage1 from "./pages/LoginPage1";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Login from "./users/Login";
import RegisterPage from "./users/RegisterPage";
import ForgotPasswordPage from "./users/ForgotPasswordPage";
import SingleRestaurant from "./restaurant/SingleRestaurant";
import MenuPage from "./menu/MenuList";
import foodDeliveryImage from "../images/foodDeliveryImages.jpeg";
function App() {
  return (
    <Router>
      <div className="d-flex flex-column">
        <div id="header">
          <div id="title">
            <img id="titleImg" src={foodDeliveryImage} alt="headerImage" />

            <h1>Food delivery</h1>
          </div>

          <Login />
        </div>
        <div className="d-flex flex-row">
          <Sidebar />

          <div
            style={{ width: "100%", height: "80vh" }}
            className="content-container"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Order" element={<Order />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/Payment" element={<Payment />} />
              <Route path="/LoginPage1" element={<LoginPage1 />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/RegisterPage" element={<RegisterPage />} />
              <Route
                path="/ForgotPasswordPage"
                element={<ForgotPasswordPage />}
              />
              <Route path="/SingleRestaurant" element={<SingleRestaurant />} />
              <Route path="/MenuPage" element={<MenuPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
