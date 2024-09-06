import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import AddRestaurant from "../restaurant/AddRestaurant";
import "./sidebar.css";
import { useState } from "react";
function NavbarHome() {
  const [activeKey, setActiveKey] = useState();
  return (
    <>
      {["sm"].map((expand) => (
        <Navbar
          key={expand}
          id="offcanvas"
          expand={expand}
          className="bg-body-tertiary mb-3"
        >
          <Container fluid>
            {/* <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand> */}
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Accordion id="accordion" activeKey={activeKey}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Add restaurant</Accordion.Header>
                      <Accordion.Body>
                        <AddRestaurant setActiveKey={setActiveKey} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default NavbarHome;
