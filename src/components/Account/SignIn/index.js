import React, { Component } from 'react';

import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import './index.scss'

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget'
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import Container from 'react-bootstrap/Container';
import ErrorHint from '../../Standard/Error';

/**
 * Default export sign-in page
 */
const SignInPage = () => (
  <Container className="body-container">
  <h1 className="sign-in-page-header">Sign In</h1>
      <SignInForm />
      <div className="sign-in-aux-text">
        <SignUpLink/>
        <PasswordForgetLink/>
      </div>
  </Container>
);

// Standard back to sign in link blurb to be used elsewhere
const BackToSignInLink = () => (
  <Link to={ROUTES.SIGN_IN}>Back to Sign In</Link>
);

/**
 * Components for the page
*/

// Define an initial state
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

// Sign in form component
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    // Initialize from the default state
    this.state = { ...INITIAL_STATE };
  }

  // Try to sign in on form submit
  onSubmit = event => {
    // Prevent page reload
    event.preventDefault();
    // Extract stuff from the state
    const { email, password } = this.state;
    // Call sign in method
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((credentials) => {
        // Reset form then go to home
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        // Display any relevant errors
        this.setState({ error });
      });
  };

  // Called when form submission changes
  onChange = event => {
    // Update state with values within form
    this.setState({ [event.target.name]: event.target.value });
  };

  // Build the view
  render() {
    // Extract fields and validate
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group>
          <Form.Control
            name="email"
            value={email}
            onChange={this.onChange}
            type="email"
            placeholder="Email Address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button disabled={isInvalid} type="submit">
          Sign In
        </Button>
        {error && <div className="sign-in-error-hint mt-3"><ErrorHint message={error.message}/></div>}
      </Form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm, BackToSignInLink };