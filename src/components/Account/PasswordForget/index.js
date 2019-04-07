import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import './index.scss'

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import ErrorHint from '../../Standard/Error';
import { BackToSignInLink } from '../SignIn'
import SuccessHint from '../../Standard/Success';

// Exported forget password page
const PasswordForgetPage = () => (
  <Container fluid className="body-container">
    <h1>Reset Password</h1>
    <p>We'll send you a password reset link if an account with the email address exists.</p>
    <PasswordForgetForm />
    <div className="my-2">
      <BackToSignInLink/>
    </div>
  </Container>
);

// Define an initial state with no email filled in
const INITIAL_STATE = {
  email: '',
  error: null,
  success: false,
};

// Form component for forget password
class PasswordForgetFormBase extends Component {

  constructor(props) {
    super(props);
    // Load the initial state as default
    this.state = { ...INITIAL_STATE };
  }

  // Called on submit - will use Firebase to attempt to send a reset email
  onSubmit = event => {

    // Prevent browser reload
    event.preventDefault();

    // Get the entered email
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        // Success - reset form
        this.setState({ ...INITIAL_STATE, success: true });
      })
      .catch(error => {
        // Display the error if call failed
        this.setState({ error });
      });

  };

  // Change current state when form is changed
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Build the component
  render() {

    // Retrieve current state & see if its valid
    const { email, error, success } = this.state;
    const isInvalid = email === '';

    return (
      <Form onSubmit={this.onSubmit} className="password-forget-form">
        <Form.Group as={Row}>
          <Col md="6">
            <Form.Control
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
          </Col>
        </Form.Group>
      
        <Button disabled={isInvalid} type="submit">
          Reset Password
        </Button>
        {error && <div className="reset-password-error-hint"><ErrorHint message={error.message}/></div>}
        {success && <div><SuccessHint message="If the account exists, an email will be sent to reset your password."/></div>}
      </Form>
    );
  }
}

// Reusable link to guide to this page
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

// Exports
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };