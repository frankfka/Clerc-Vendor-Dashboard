import React, {Component} from 'react';

import { withAuthentication, withAuthorization } from '../Session';

import { compose } from 'recompose'

class HomePageBase extends Component {

  render() {
    const { authUser } = this.props

    return (
      <div>
        <h1>Home</h1>
        <h3>{authUser.email}</h3>
      </div>
    )
  }

}

const isSignedIn = authUser => !!authUser;
const HomePage = compose(
  withAuthentication,
  withAuthorization(isSignedIn)
  )(HomePageBase);

export default HomePage;