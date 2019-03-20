import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import SetupStart from './SetupStart'
import StripeRedirect from './StripeRedirect'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Route exact path="/setup" component={SetupStart} />
            <Route path='/setup/stripe-redirect' component={StripeRedirect}/>
        </Router>
      </div>
    );
  }
}

export default App;
