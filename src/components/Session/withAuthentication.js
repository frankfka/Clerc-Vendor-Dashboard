import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

// Higher order component to bundle authentication
// Provides the currently authed user as authUser if a user is signed in
const withAuthentication = Component => {
  
  class WithAuthenticationBase extends React.Component {
    constructor(props) {
        super(props);
        // TODO we should move to redux at some point
        // Initial state with no user logged in
        this.state = {
            authUser: JSON.parse(localStorage.getItem('authUser')),
        };
    }

    // Create a listener for changes in authentication
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        // If an auth user is passed (i.e someone is logged in)
        // Update the current state and use local storage to save the current user
        // This decreases the loading time as we don't wait for firebase
        // If null is passed, we set authUser as null
        authUser => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          this.setState({ authUser });
        },
        // Error case where no authUser is given
        () => {
          localStorage.removeItem('authUser');
          this.setState({ authUser: null });
        },
      );
    }

    // To avoid performance issues, remove listener when component unmounts
    componentWillUnmount() {
      this.listener();
    }

    // Render the component bundled with the authentication value
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component authUser={this.state.authUser} {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthenticationBase);
};

export default withAuthentication;