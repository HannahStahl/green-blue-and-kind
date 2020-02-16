import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, withRouter, Route, Switch,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home';
import Cart from './components/Cart';
import Category from './components/Category';
import Product from './components/Product';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import config from './config';

const Routes = ({ categories, updateCart }) => (
  <Switch>
    <Route path="/" exact render={(props) => <Home {...props} categories={categories} />} />
    <Route path="/categories/:id" exact render={(props) => <Category {...props} />} />
    <Route path="/products/:id" exact render={(props) => <Product {...props} updateCart={updateCart} />} />
    <Route path="/cart" exact render={(props) => <Cart {...props} updateCart={updateCart} />} />
    <Route component={NotFound} />
  </Switch>
);

const App = withRouter(() => {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  function updateCart() {
    const cartStr = localStorage.getItem('cart');
    setCart(cartStr ? JSON.parse(cartStr) : []);
  }

  useEffect(() => {
    fetch(`${config.apiURL}/categories`).then((res) => res.json()).then((json) => {
      setCategories(json);
    });
    updateCart();
  }, []);

  return (
    <>
      <NavBar categories={categories} cart={cart} />
      <div>
        <Routes categories={categories} updateCart={updateCart} />
      </div>
      <Footer />
    </>
  );
});

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
