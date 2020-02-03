import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import CartIcon from './CartIcon';

const NavBar = () => (
  <Navbar collapseOnSelect expand="lg">
    <Navbar.Brand href="/">
      <img
        alt="Home"
        src="logo.png"
        height="50"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="ml-auto" activeKey={window.location.pathname}>
        <Nav.Link href="/products">Products</Nav.Link>
        <Nav.Link href="/cart"><CartIcon /></Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
