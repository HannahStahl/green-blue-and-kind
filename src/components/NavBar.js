import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import CartIcon from './CartIcon';
import CartAmount from './CartAmount';

const NavBar = ({ categories, cart }) => (
  <Navbar collapseOnSelect expand="lg" fixed="top">
    <Navbar.Brand href="/">
      <img
        alt="Green, Blue + Kind"
        src={`${process.env.PUBLIC_URL}/logo.png`}
        height="70"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav activeKey={window.location.pathname}>
        <div className="centered-nav-links">
          {categories && categories.map((category) => (
            <Nav.Link key={category._id} className="category-nav-link" href={escape(`/items/${category.name.toLowerCase().replace(/ /g, '_')}`)}>
              {category.name}
            </Nav.Link>
          ))}
        </div>
        <Nav.Link className="cart-nav-link" href="/cart">
          <CartIcon />
          <CartAmount cart={cart} />
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
