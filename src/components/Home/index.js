import React, {Component} from 'react';

import { withAuthentication, withAuthorization } from '../Session';
import SetupStart from '../VendorSetupStart';
import * as ERROR from '../../constants/errors'

import { compose } from 'recompose'
import Loading from '../Standard/Loading';

import './index.scss'

class HomePageBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      authUser: this.props.authUser, // Never null
    };
  }

  render() {
    const {store, loaded} = this.state

    // Check that all required conditions are met
    if (loaded && store != null) {
      // THIS IS THE MAIN COMPONENT
      return (
        <h1>{store}</h1>
      )
    } else {
      // Check for the error state
      if (!loaded) {
        // Still loading
        return (
          <div className="loading-animation-home">
            <Loading/>
          </div>
        )
      } else if (store == null) {
        // No store, show setup screen
        return (
          <SetupStart/>
        )
      }
    }
  }

  // On component mount, we retrieve and set state for the store that the vendor manages
  componentDidMount() {
    // Fetch the store that the authed user is in charge of
    const component = this
    const firebase = this.props.firebase
    const uid = this.state.authUser.uid
    firebase.getStoreIdsForVendor(uid)
      .then(function(stores) {
        console.log("Vendor object found successfully")
        // We only support one store for now, so get the first element or null
        let storeId = null;
        if (stores.length > 0) {
          storeId = stores[0];
        }
        // Set the current state
        component.setState({
          loaded: true,
          store: storeId
        });
      })
      // Called when we fail to create a vendor on sign-up
      .catch(function(error) {
        console.error(error.message) 
        // If we failed to create a vendor on sign-up, we catch it here
        // Then attempt to make vendor object again here
        if (error.message === ERROR.VENDOR_DNE) {
          // Create vendor and set state if success, or reload page if fail
          firebase.doCreateVendor(uid)
          .then(function() {
            component.setState({
              loaded: true,
              store: null
            });
          })
          .catch(function(error) {
            console.error("Vendor object was not created and recreating failed. Reloading page");
            window.location.reload();
          })
        }
      })
  }
}

const isSignedIn = authUser => !!authUser;
const HomePage = compose(
  withAuthentication,
  withAuthorization(isSignedIn)
  )(HomePageBase);

export default HomePage;