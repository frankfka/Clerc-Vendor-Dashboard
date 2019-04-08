import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from './components/Navigation';
import SignUpPage from './components/Account/SignUp';
import SignInPage from './components/Account/SignIn';
import PasswordForgetPage from './components/Account/PasswordForget';
import HomePage from './components/Home';
import AccountPage from './components/Account/AccountPage';

import { withAuthentication } from './components/Session';

import * as ROUTES from './constants/routes';
import Footer from './components/Footer';
import StripeRedirect from './components/VendorSetupRedirect';
import ProductDetail from './components/Product/ProductDetail';

/**
 * Everything is rendered within the App component
 */
class App extends Component {

  // Build the view
  render() {

    return (
      <div className="main-app">
        <Router>
            <Navigation/>

            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.STRIPE_REDIRECT} component={StripeRedirect} />
            <Route path={ROUTES.PRODUCT_DETAIL} component={ProductDetail} />
            <Footer/>
        </Router>
      </div>
    );
  }
}

// Export the main app bundled with the current auth object
export default withAuthentication(App);
