import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css'

import SetupStart from './pages/SetupStart'
import StripeRedirect from './pages/StripeRedirect'
import SetupResult from './pages/SetupResult'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Route exact path="/setup" component={SetupStart} />
            <Route path='/setup/stripe-redirect' component={StripeRedirect}/>
            <Route path='/setup/setup-finished' component={SetupResult}/>
        </Router>
      </div>
    );
  }
}

export default App;
