import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context'

// This takes in a condition, and if the condition evaluates to false
// We push the sign-in page to the user - this will block unauthed users 
// From accessing restricted pages
const withAuthorization = condition => Component => {

  class WithAuthorization extends React.Component {

    // Create a listener for the auth status
    // If the condition evaluates to false, we'll push the sign-in page
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.SIGN_IN);
          }
        },
      );
    }

    // Clear listener for performance
    componentWillUnmount() {
      this.listener();
    }

    // Render the same component if the condition evaluates to true, else render nothing
    // This is done here as well (as opposed to only pushing the sign-in page)
    // So that we don't get accidental access when browser is slow to redirect
    render() {
      return (
        <AuthUserContext.Consumer>
            {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
            }
        </AuthUserContext.Consumer>
      );
    }
  }

  // Bundle this component with our firebase context & react router
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;
