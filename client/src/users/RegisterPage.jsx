// import e from "cors";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useRegisterUserMutation } from "../slices/userApiSlice";
// import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setUserInfoOnLoginOrRegister } from "../slices/authSlice";
const RegisterPage = ({ setRegisterModal }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { isLoading }] = useRegisterUserMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({
      name,
      phoneNumber,
      email,
      password,
      confirmPassword,
    }).unwrap();
    dispatch(setUserInfoOnLoginOrRegister({ ...res }));
    setRegisterModal(false);
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>PhoneNumber:</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>confirmPassword:</Form.Label>
              <Form.Control
                type="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" disabled={isLoading} className="my-2">
              Register
            </Button>
            {/* {isLoading && <Loader />} */}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
