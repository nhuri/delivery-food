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
import { FcSearch } from "react-icons/fc";
import Modal from "react-bootstrap/Modal";
import RButton from './rButton';
import { useSelector } from 'react-redux';
function NavbarHome() {
  // const [activeKey, setActiveKey] = useState(); //removed
  const [showModal, setShowModal] = useState(false); // Added 
  const [searchValue, setSearchValue] = useState("");
  const handleInputSearch = (e) => {
    setSearchValue(e.target.value);
  };
  const handleSearchRestaurant = () => { };
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFilter = (category) => {
    setSelectedCategory(category);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const currentUserType = userInfo ? userInfo.role : 'guest';
  console.log(userInfo)

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
                    <RButton onClick={handleShowModal} hoverEffect={true} visibleTo={'all'} currentUserType={currentUserType}>
                      Add Restaurant
                    </RButton>
                    {/* <Button id="red-btn"
                      onClick={handleShowModal}
                      style={{
                        backgroundColor: '#FF5252',
                        color: '#f8f9fa',
                        fontWeight: 'bold',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: '1px solid #FF5252',
                        transition: 'all 0.3s ease-in-out',
                        marginTop: 5,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.color = '#FF5252';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#FF5252';
                        e.target.style.color = '#f8f9fa';
                      }}
                    >
                      Add Restaurant
                    </Button> */}
                  </Nav>
                </div>
                <Nav id="iconNav" className="d-flex flex-column">
                  <div
                    className={`icon-container ${selectedCategory === "All" ? "selected" : ""
                      }`}
                    onClick={() => handleFilter("All")}
                  >
                    <IoFastFood id="icon" />
                    <div>All</div>
                  </div>
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <div
                    className={`icon-container ${selectedCategory === "Burger" ? "selected" : ""
                      }`}
                    onClick={() => handleFilter("Burger")}
                  >
                    <IoFastFood id="icon" />
                    <div>Burger</div>
                  </div>
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <div
                    className={`icon-container ${selectedCategory === "Pizza" ? "selected" : ""
                      }`}
                    onClick={() => handleFilter("Pizza")}
                  >
                    <IoPizza id="icon" />
                    <div>Pizza</div>
                  </div>
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <div
                    className={`icon-container ${selectedCategory === "Italian" ? "selected" : ""
                      }`}
                    onClick={() => handleFilter("Italian")}
                  >
                    <IoFishSharp id="icon" />
                    <div>Italian</div>
                  </div>
                </Nav>
                <Nav id="iconNav" className="d-flex flex-column">
                  <div
                    className={`icon-container ${selectedCategory === "Drink" ? "selected" : ""
                      }`}
                    onClick={() => handleFilter("Drink")}
                  >
                    <BiDrink id="icon" />
                    <div>Drink</div>
                  </div>
                </Nav>
                <Form className="search-form d-flex ms-auto">
                  <Form.Control
                    id="search-input"
                    onChange={handleInputSearch}
                    type="search"
                    placeholder="Search by name or category"
                    className="me-2"
                    aria-label="Search"
                    value={searchValue}
                  />
                  <Button
                    onClick={handleSearchRestaurant}
                    variant="outline-success"
                    className="search-button"
                  >
                    Search <FcSearch className="search-icon" />
                  </Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRestaurant setShowModal={setShowModal} />
        </Modal.Body>
      </Modal>

      <RestaurantList
        searchValue={searchValue}
        selectedCategory={selectedCategory}
      />
    </>
  );
}

export default NavbarHome;
