import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Route exact path="/setup" component={Setup} />
            <Route path="/setup/stripe-redirect" component={StripeRedirect} />
        </Router>
      </div>
    );
  }
}

function Setup() {
  return (
    <div>
      <h2>Setup</h2>
    </div>
  );
}

function StripeRedirect({location}) {

  const queryParser = require('query-string');
  const queries = queryParser.parse(location.search);
  console.log(queries);

  let text = "no params"
  
  if (queries.error) {
    text = "Error: " + queries.error
  } else if (queries.code) {
    text = "Code: " + queries.code
  }

  return (
    <div>
      <h2>{text}</h2>
    </div>
  );
}

export default App;
