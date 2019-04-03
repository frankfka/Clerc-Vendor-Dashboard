import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

/**
 * Default export sign-up page
 */
const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm/>
  </div>
);

/**
 * Components for the page
*/

// Define an initial state
const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

// Sign Up Form component
class SignUpFormBase extends Component {

  constructor(props) {
    super(props);
    // Init state with the initial values
    this.state = { ...INITIAL_STATE };
  }

  // On form submission, we send data to firebase to register a new user
  onSubmit = event => {
    // Prevent page reload
    event.preventDefault();
    // Extract required fields from current state - these should be validated!
    const { email, passwordOne } = this.state;

    // Call the firebase method (passed in through context)
    // Trim email to get rid of whitespace
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email.trim(), passwordOne)
      .then(authUser => {
        // Reset form to initial state
        this.setState({ ...INITIAL_STATE });
        // Then push to home page
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        // If an error occurs, display error in the error field under form
        this.setState({ error });
      });
  }

  // On form change, we update the current state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Build the view
  render() {

    // Extract fields from current state
    const {
      firstName,
      lastName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    // Used for form validation
    const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    firstName === '' ||
    lastName === '';

    return (
      <Form onSubmit={this.onSubmit}
            validated={!isInvalid}>

        {/* Name */}
        <Form.Group>
          <Form.Row>
            <Col>
              <Form.Control 
                required
                name="firstName"
                value={firstName}
                onChange={this.onChange}
                type="text"
                placeholder="First Name"/>
            </Col>
            <Col>
              <Form.Control 
                required
                name="lastName"
                value={lastName}
                onChange={this.onChange}
                type="text"
                placeholder="Last Name"/>
            </Col>
          </Form.Row>
        </Form.Group>
        
        {/* Email */}
        <Form.Group>
          <Form.Control
            required
            name="email"
            type="email"
            value={email}
            onChange={this.onChange}
            placeholder="Email Address"
          />
        </Form.Group>

        {/* Passwords */}
        <Form.Group>
          <Form.Control
            required
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            required        
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Group>

        <Button type="submit" disabled={isInvalid}>Sign Up</Button>
        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

// The above sign up form but wrapped with firebase
const SignUpForm = compose(
  withRouter,
  withFirebase
  )(SignUpFormBase);

// Standard sign up link blurb to be used elsewhere
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };