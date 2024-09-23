import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
// import Review from "./pages/Review";
import LoginPage1 from "./pages/LoginPage1";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import RegisterPage from "./users/RegisterPage";
import ForgotPasswordPage from "./users/ForgotPasswordPage";
import SingleRestaurant from "./restaurant/SingleRestaurant";
import MenuList from "./menu/MenuList";
import ReviewsPage from "./reviews/reviewsPage";
import { useVerifyTokenQuery } from "./slices/userApiSlice";
import { setUserInfoOnLoginOrRegister , logout } from "./slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { data: userData, error, isLoading } = useVerifyTokenQuery();

  useEffect(() => {
    if (userData && userData.data && userData.data.user) {
      dispatch(setUserInfoOnLoginOrRegister(userData.data.user));
    } else if (error) {
      console.error("Token verification error:", error);
      dispatch(logout());
    }
  }, [userData, error, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }



  return (
    <Router>
      <div className="d-flex flex-column">
        <Sidebar />
        <div className="main-content-area flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Profile" element={<Profile />} />
            {/* <Route path="/Review" element={<Review />} /> */}
            <Route path="/Payment" element={<Payment />} />
            <Route path="/LoginPage1" element={<LoginPage1 />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
            <Route
              path="/ForgotPasswordPage"
              element={<ForgotPasswordPage />}
            />
            <Route path="/SingleRestaurant" element={<SingleRestaurant />} />
            <Route path="/MenuList" element={<MenuList />} />
            <Route path="/ReviewsPage" element={<ReviewsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;