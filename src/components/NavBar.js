import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import CartIcon from './CartIcon';

const NavBar = ({ categories }) => (
  <Navbar collapseOnSelect expand="lg" fixed="top">
    <Navbar.Brand href="/">
      <img
        alt="Home"
        src={process.env.PUBLIC_URL + "/logo.png"}
        height="50"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav activeKey={window.location.pathname}>
        <div className="centered-nav-links">
          {categories && categories.map(category => (
            <Nav.Link key={category.categoryId} className="category-nav-link" href={`/categories/${category.categoryId}`}>
              {category.categoryName}
            </Nav.Link>
          ))}
        </div>
        <Nav.Link className="cart-nav-link" href="/cart"><CartIcon /></Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
