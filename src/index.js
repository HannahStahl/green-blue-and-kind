import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, withRouter, Route, Switch,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Home from './components/Home';
import About from './components/About';
import Portfolio from './components/Portfolio';
import NotFound from './components/NotFound';
import NavBar from './components/NavBar';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/about" exact component={About} />
    <Route path="/portfolio" exact component={Portfolio} />
    <Route component={NotFound} />
  </Switch>
);
const App = withRouter(() => (
  <>
    <NavBar />
    <div className="page-content">
      <Routes />
    </div>
  </>
));
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
