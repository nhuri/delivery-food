import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useForgotPasswordMutation } from "../slices/userApiSlice";

const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading1 }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("You must enter email before you press on forgot password");
    } else {
      const response = forgotPassword({ email }).unwrap();
      dispatch(setUserInfoOnLoginOrRegister({ ...response }));
      handleCloseLoginModal();
      alert(
        "Enter to your email and Press on the link in the email you got right now"
      );
    }
  };
  return (
    <>
      <input
        type="text"
        id="usernameLogin"
        placeholder="enter your email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Button
        id="forgot-password-btn"
        variant="primary"
        onClick={handleForgotPassword}
      >
        forgot password
      </Button>
    </>
  );
};

export default ForgotPasswordPage;
