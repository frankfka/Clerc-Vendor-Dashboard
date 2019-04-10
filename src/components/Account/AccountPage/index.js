import React, { Component } from 'react';

import { withAuthorization, withAuthentication } from '../../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

import './index.scss'

import { compose } from 'recompose';
import Container from 'react-bootstrap/Container';

class AccountPageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      showForgetPassword: false,
      showChangePassword: false
    }
  }

  // Show the relevent elements
  forgetPasswordClicked = (event) => {
    event.preventDefault()
    this.setState({
      showForgetPassword: true,
      showChangePassword: false
    })
  }
  changePasswordClicked = (event) => {
    event.preventDefault()
    this.setState({
      showForgetPassword: false,
      showChangePassword: true
    })
  }

  render() {
    
    const { authUser } = this.state

    return (
      <Container fluid className="body-container">
        <h1>Your Account</h1>

        <div>
          <h4 className="account-page-heading">Account Details</h4>
          <p><strong>Email: </strong> {authUser.email}</p>
          <p><strong>Password: </strong> <span className="link-text" onClick={e => {this.changePasswordClicked(e)}}>Change Password</span> | <span className="link-text" onClick={ e => {this.forgetPasswordClicked(e)}}>Forgot Password?</span></p>
        </div>
      </Container>   
    )
  }

}

const isSignedIn = authUser => !!authUser;
const AccountPage = compose(
  withAuthentication,
  withAuthorization(isSignedIn),
  )(AccountPageBase);

export default AccountPage;
