// import e from "cors";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useRegisterUserMutation } from "../slices/userApiSlice";
// import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setUserInfoOnLoginOrRegister } from "../slices/authSlice";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterUserMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, mail, password }).unwrap();
    dispatch(setUserInfoOnLoginOrRegister({ ...res }));
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
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setMail(e.target.value)}
                value={mail}
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
