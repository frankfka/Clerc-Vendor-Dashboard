import React, { Component } from 'react';

import { withAuthorization, withAuthentication } from '../../Session';
import PasswordChangeForm from '../PasswordChange';

import './index.scss'

import { compose } from 'recompose';
import Container from 'react-bootstrap/Container';
import { withFirebase } from '../../Firebase';
import SuccessHint from '../../Standard/Success';

class AccountPageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      passwordResetSent: false,
      showChangePassword: false
    }
  }

  // Show the relevent elements
  forgetPasswordClicked = (event) => {
    event.preventDefault()
    const { authUser } = this.state 
    const component = this
    this.props.firebase.doPasswordReset(authUser.email)
                       .then(function() {
                         component.setState({
                           passwordResetSent: true
                         })
                       })
  }
  changePasswordClicked = (event) => {
    event.preventDefault()
    this.setState(prevState => ({
      showChangePassword: !prevState.showChangePassword
    }))
  }

  render() {
    
    const { authUser, passwordResetSent, showChangePassword } = this.state

    return (
      <Container fluid className="body-container">
        <h1>Your Account</h1>

        <div>
          <h4 className="account-page-heading">Account Details</h4>
          <p><strong>Email: </strong> {authUser.email}</p>
          <p><strong>Password: </strong> <span className="link-text" onClick={e => {this.changePasswordClicked(e)}}>Change Password</span> | <span className="link-text" onClick={ e => {this.forgetPasswordClicked(e)}}>Forgot Password?</span></p>
          { showChangePassword && <PasswordChangeForm/> }
          { passwordResetSent && <SuccessHint message="Password reset email has been sent."/>}
        </div>
      </Container>   
    )
  }

}

const isSignedIn = authUser => !!authUser;
const AccountPage = compose(
  withFirebase,
  withAuthentication,
  withAuthorization(isSignedIn),
  )(AccountPageBase);

export default AccountPage;
