import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// Exported forget password page
const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

// Define an initial state with no email filled in
const INITIAL_STATE = {
  email: '',
  error: null,
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
        this.setState({ ...INITIAL_STATE });
        // TODO push to login? 
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
    const { email, error } = this.state;
    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Reset Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
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