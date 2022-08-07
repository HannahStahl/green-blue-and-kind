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
// import Banner from './components/Banner';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import config from './config';

const Routes = ({
  categories, products, tags, updateCart,
}) => (
  <Switch>
    <Route path="/" exact render={(props) => <Home {...props} categories={categories} />} />
    <Route path="/items/:category" exact render={(props) => <Category {...props} categories={categories} tags={tags} />} />
    <Route path="/items/:category/:product" exact render={(props) => <Product {...props} categories={categories} updateCart={updateCart} />} />
    <Route path="/cart" exact render={(props) => <Cart {...props} categories={categories} products={products} updateCart={updateCart} />} />
    <Route component={NotFound} />
  </Switch>
);

const App = withRouter(() => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  function updateCart() {
    const cartStr = localStorage.getItem('cart');
    setCart(cartStr ? JSON.parse(cartStr) : []);
  }

  useEffect(() => {
    const productFields = `
      _id
      name
      description
      price
      salePrice
      images {
        _key
        asset {
          url
        }
      }
      sizes {
        _id
        name
      }
      colors {
        _id
        name
      }
      tags {
        _id
        name
      }
    `;
    fetch(config.sanityURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allCategory(sort: { name: ASC }) {
              _id
              name
              image {
                asset {
                  url
                }
              }
              products {
                ${productFields}
              }
            }
            allProduct {
              ${productFields}
            }
            allTag {
              _id
              name
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        setCategories(data.allCategory);
        setProducts(data.allProduct);
        setTags(data.allTag);
        setLoading(false);
      });
    updateCart();
  }, []);

  return loading ? <LoadingSpinner /> : (
    <>
      <NavBar categories={categories} cart={cart} />
      {/* <Banner /> */}
      <div>
        <Routes categories={categories} products={products} tags={tags} updateCart={updateCart} />
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
