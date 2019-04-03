import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

// Higher order component to bundle authentication
const withAuthentication = Component => {
  class WithAuthenticationBase extends React.Component {
    constructor(props) {
        super(props);
        // TODO we should move to redux at some point
        // Initial state with no user logged in
        this.state = {
            authUser: null,
        };
    }

    // Create a listener for changes in authentication
    componentDidMount() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
            authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
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
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthenticationBase);
};

export default withAuthentication;