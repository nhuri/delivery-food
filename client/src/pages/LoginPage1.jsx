import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {
  useIsAuthQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { logout, setUserInfoOnLoginOrRegister } from "../slices/authSlice";
import { Navigate, useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";

const LoginPage1 = () => {
  const [login, { isLoading }] = useLoginUserMutation();

  const [logout] = useLogoutUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout().unwrap();

    setBool(false);
  };

  const handleVerifyDetails = async (e) => {
    e.preventDefault();
    logout().unwrap();
    const response = await login({ email, password }).unwrap();
    dispatch(setUserInfoOnLoginOrRegister({ ...response }));
    if (response.status === "success") {
      setBool(true);
    }
  };

  const navigate = useNavigate();

  const handleRegisterPage = () => {
    navigate("/RegisterPage");
  };
  const handleForgotPasswordPage = () => {
    navigate("/ForgotPasswordPage");
  };
  const [bool, setBool] = useState(true);
  //   const { data } = useIsAuthQuery();
  //   useEffect(() => {
  //     if (data) {
  //       setBool(data.isAuth);
  //     }
  //   }, [data]);
  //   useEffect(() => {
  //     bool;
  //   }, [bool]);

  // useEffect(() => {
  //   if (data) {
  //     setBool(data.isAuth);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   console.log(bool);
  // }, [bool]);

  return (
    <>
      <div id="userLogin">
        <input
          type="text"
          id="usernameLogin"
          placeholder="enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="text"
          id="passwordLogin"
          placeholder="enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button id="login-btn" variant="primary" onClick={handleVerifyDetails}>
          login
        </Button>
        {/* {isLoading && <Loader />} */}
        {/* {isLoading2 && <Loader />} */}
        <Button
          id="register-btn"
          variant="tertiary"
          onClick={handleRegisterPage}
        >
          register
        </Button>
        <Button
          id="forgot-password-btn"
          variant="primary"
          onClick={handleForgotPasswordPage}
        >
          forgot password
        </Button>
        {/* {isLoading1 && <Loader />} */}
      </div>
    </>
  );
};
export default LoginPage1;
