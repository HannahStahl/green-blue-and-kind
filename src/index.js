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
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';
import config from './config';

const Routes = ({ categories }) => (
  <Switch>
    <Route path="/" exact render={() => <Home categories={categories} />} />
    <Route path="/categories/:id" exact render={() => <Category />} />
    <Route path="/cart" exact render={() => <Cart categories={categories} />} />
    <Route component={NotFound} />
  </Switch>
);

const App = withRouter(() => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${config.apiURL}/categories`).then(res => res.json()).then((json) => {
      setCategories(json);
    });
  }, []);
  return (
    <>
      <NavBar categories={categories} />
      <div>
        <Routes categories={categories} />
      </div>
    </>
  );
});

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
