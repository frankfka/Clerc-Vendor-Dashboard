import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import * as ROUTES from '../../constants/routes';

import SignOutButton from '../Account/SignOut'
import { AuthUserContext } from '../Session';

// Exported navigation component that consumes current auth & renders conditionally
const Navigation = () => (
      <Navbar className="main-nav" sticky="top">
        <Navbar.Brand>
          <Link to={ROUTES.HOME} className="nav-logo-text">Clerc</Link>
        </Navbar.Brand>
        <div className="ml-auto">
          <AuthUserContext.Consumer>
            {
              authUser => authUser ? <NavSignedIn/> : <NavNotSignedIn />
            }
          </AuthUserContext.Consumer>
        </div>
      </Navbar>
);

// Shown when user is currently signed in 
const NavSignedIn = () => (
  <div>
    <Nav>
      <Nav.Item>
        <Link to={ROUTES.HOME}>Home</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </Nav.Item>
      <SignOutButton />
    </Nav>
  </div>
);

// Shown when no current user is signed in
const NavNotSignedIn = () => (
  <Nav>
    <Button type="button">
      <Link to={ROUTES.ACCOUNT}>Sign In</Link>
    </Button>
  </Nav>
);

export default Navigation;
