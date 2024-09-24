import "./users.css";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import RegisterPage from "./RegisterPage";
import {
  useForgotPasswordMutation,
  useIsAuthQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserInfoOnLoginOrRegister } from "../slices/authSlice";
const Login = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const handleCloseRegisterModal = () => setRegisterModal(false);
  const handleOpenRegisterModal = () => {
    setRegisterModal(true);
  };

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const handleCloseForgotPasswordModal = () => setForgotPasswordModal(false);
  const handleOpenForgotPasswordModal = () => setForgotPasswordModal(true);
  const [forgotPassword, { isLoading1 }] = useForgotPasswordMutation();

  const [loginModal, setLoginModal] = useState(false);

  const handleCloseLoginModal = () => setLoginModal(false);
  const handleOpenLoginModal = () => setLoginModal(true);
  const [login, { isLoading }] = useLoginUserMutation();

  const [logoutBack] = useLogoutUserMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); //  state for form validation errors
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(logout());
    await logoutBack().unwrap();
    setBool(false);
  };

  const handleVerifyDetails = async (e) => {
    e.preventDefault();
    dispatch(logout());
    logoutBack().unwrap();
    const response = await login({ email, password }).unwrap();
    dispatch(setUserInfoOnLoginOrRegister({ ...response }));
    if (response.status === "success") {
      handleCloseLoginModal();
      handleCloseForgotPasswordModal();
      setBool(true);
      window.location.reload();
    }
  };

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
  const userInfo = useSelector((state) => state.auth.userInfo);

  const data = userInfo ? true : false;
  const [bool, setBool] = useState(data);
  useEffect(() => {
    setBool(data);
  }, [userInfo]);

  useEffect(() => {
    if (data) {
      setBool(data);
    }
  }, [data]);
  useEffect(() => {
    bool;
  }, [bool]);

  // const handleSocialLogin = (provider) => {
  //   // This is a placeholder function. You would implement the actual social login logic here.
  //   console.log(`Logging in with ${provider}`);
  // };
  return (
    <>
      <div id="login">
        {!bool && (
          <button id="openLoginModal" onClick={handleOpenLoginModal}>
            <img id="loginLogo" src="images/login.png" alt="sc-icon" />
          </button>
        )}
        {bool && (
          <button id="openLogoutModal" onClick={handleLogout}>
            <img id="logoutLogo" src="images/logout.jpg" alt="sc-icon" />
          </button>
        )}
      </div>

      <Modal show={registerModal} onHide={handleCloseRegisterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterPage setRegisterModal={setRegisterModal} />
        </Modal.Body>
      </Modal>

      <Modal show={forgotPasswordModal} onHide={handleCloseForgotPasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>ForgotPassword form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>

      <Modal id="loginModal" show={loginModal} onHide={handleCloseLoginModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            <Button
              id="login-btn"
              variant="primary"
              onClick={handleVerifyDetails}
            >
              login
            </Button>
            {/* {isLoading && <Loader />} */}
            {/* {isLoading2 && <Loader />} */}
            <Button
              id="register-btn"
              variant="tertiary"
              onClick={handleOpenRegisterModal}
            >
              register
            </Button>
            <Button
              id="forgot-password-btn"
              variant="primary"
              onClick={handleOpenForgotPasswordModal}
            >
              forgot password
            </Button>
            {/* {isLoading1 && <Loader />} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLoginModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseLoginModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Login;
