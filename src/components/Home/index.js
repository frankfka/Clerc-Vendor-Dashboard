import React, {Component} from 'react';

import { withAuthentication, withAuthorization, withStore } from '../Session';
import SetupStart from '../VendorSetupStart';

import { compose } from 'recompose'
import Loading from '../Standard/Loading';

import './index.scss'

class HomePageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      store: null,
      authUser: this.props.authUser, // Never null
    };
  }

  render() {

    const { loading, store } = this.state

    // Check that all required conditions are met
    if (!loading && store) {
      // THIS IS THE MAIN COMPONENT
      return (
        <h1>{store.name}</h1>
      )
    } else {
      // Check for the error state
      if (loading) {
        // Still loading
        return (
          <div className="loading-animation-home">
            <Loading/>
          </div>
        )
      } else if (!store) {
        // No store, show setup screen
        return (
          <SetupStart/>
        )
      }
    }
  }

  // Watch for prop changes & update state
  componentDidUpdate(oldProps) {
    const { loadingStore, currentStore } = this.props
    if (oldProps.loadingStore !== loadingStore || oldProps.currentStore !== currentStore) {
      this.setState({
        loading: loadingStore,
        store: currentStore
      })
    }
  }

}

const isSignedIn = authUser => !!authUser;
const HomePage = compose(
  withAuthentication,
  withAuthorization(isSignedIn),
  withStore,
  )(HomePageBase);

export default HomePage;