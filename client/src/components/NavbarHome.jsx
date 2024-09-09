import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import AddRestaurant from "../restaurant/AddRestaurant";
import "./components.css";
import { useState } from "react";
import { IoPizza } from "react-icons/io5";
import { BiDrink } from "react-icons/bi";
import { IoFishSharp } from "react-icons/io5";
import { IoFastFood } from "react-icons/io5";
import RestaurantList from "../restaurant/RestaurantList";
function NavbarHome() {
  const [activeKey, setActiveKey] = useState();
  const [searchValue, setSearchValue] = useState("");
  const handleInputSearch = (e) => {
    setSearchValue(e.target.value);
  };
  const handleSearchRestaurant = () => {};
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
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Body>
                <div id="addRestaurant">
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
                </div>
                <Nav id="iconNav" className="d-flex flex-column">
                  <IoFastFood id="icon" />
                  All
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <IoFastFood id="icon" />
                  burger
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <IoPizza id="icon" />
                  pizza
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <IoFishSharp id="icon" />
                  fish
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <BiDrink id="icon" />
                  beverages
                </Nav>
                <Form className="d-flex ms-auto">
                  <Form.Control
                    onChange={handleInputSearch}
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={searchValue}
                  />
                  <Button
                    onClick={handleSearchRestaurant}
                    variant="outline-success"
                  >
                    Search
                  </Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <RestaurantList searchValue={searchValue} />
    </>
  );
}

export default NavbarHome;
