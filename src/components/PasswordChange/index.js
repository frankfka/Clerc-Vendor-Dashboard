import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

// Define an initial state for the form (all empty)
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

// Build the component that we export
class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    // Load initial state
    this.state = { ...INITIAL_STATE };
  }

  // Called on submission of form
  onSubmit = event => {
    // Prevent browser reload
    event.preventDefault();

    // Get entered password
    const { passwordOne } = this.state;

    // Call firebase to update password
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        // On success, reset to initial state
        // TODO do we want to force a sign-out then redirect to sign-in?
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  // On form change, update the state
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Build the view
  render() {

    // Get the current state & check for validity
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Reset Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
