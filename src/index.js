import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, withRouter, Route, Switch,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home';
import Cart from './components/Cart';
import Products from './components/Products';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/cart" exact component={Cart} />
    <Route path="/products" exact component={Products} />
    <Route component={NotFound} />
  </Switch>
);
const App = withRouter(() => (
  <>
    <NavBar />
    <div>
      <Routes />
    </div>
  </>
));
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
