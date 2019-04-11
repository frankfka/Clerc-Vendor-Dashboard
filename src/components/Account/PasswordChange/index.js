import React, { Component } from 'react';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { withFirebase } from '../../Firebase';
import ErrorHint from '../../Standard/Error';

import './index.scss'
import SuccessHint from '../../Standard/Success';

// Define an initial state for the form (all empty)
const INITIAL_STATE = {
  currentPassword: '',
  newPasswordOne: '',
  newPasswordTwo: '',
  error: null,
  success: false,
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

    // Reset success/error
    this.setState({
      success: false,
      error: null
    })

    // Get entered password
    const { currentPassword, newPasswordOne } = this.state;

    // Call firebase to update password
    this.props.firebase
      .doPasswordUpdate(currentPassword, newPasswordOne)
      .then(() => {
        // On success, reset to initial state
        // TODO do we want to force a sign-out then redirect to sign-in?
        this.setState({ ...INITIAL_STATE, success: true });
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
    const { currentPassword, newPasswordOne, newPasswordTwo, error, success } = this.state;

    const isInvalid = currentPassword === '' || 
                      newPasswordOne !== newPasswordTwo || newPasswordOne === '';

    return (
      <div className="password-change-form"> 
      <Form onSubmit={this.onSubmit}>
        <Form.Group as={Row}>
          <Col md="12">
            <Form.Control
                name="currentPassword"
                value={currentPassword}
                onChange={this.onChange}
                type="password"
                placeholder="Current Password"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col md="6">
            <Form.Control
            name="newPasswordOne"
            value={newPasswordOne}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
          </Col>
          <Col md="6">
            <Form.Control
            name="newPasswordTwo"
            value={newPasswordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm New Password"
            />
          </Col>
        </Form.Group>
       
        <Button disabled={isInvalid} type="submit">
          Change Password
        </Button>

        <div className="messages">
          {success && <SuccessHint message="Your password was successfully changed"/>}
          {error && <ErrorHint message={error.message}/>}
        </div>

      </Form>
      </div>
      
    );
  }
}

export default withFirebase(PasswordChangeForm);
