import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

/**
 * Default export sign-in page
 */
const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignUpLink />
  </div>
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
      .then(() => {
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

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };