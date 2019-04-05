import React from 'react';

import StoreUserContext from './storeContext';
import * as ERROR from '../../constants/errors'

import { withFirebase } from '../Firebase';

// Higher order component to bundle current store so we don't need to retrieve it multiple times
const WithStore = Component => {
  
  class WithStoreBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          // TODO do we want an error state?
          currentStore: null,
          loadingStore: true
        };
    }

    // Create a listener for changes in authentication
    // We DON'T currently allow multiple stores - so log in/out is the only
    // thing that can change the current store
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        // If an auth user is passed (i.e someone is logged in)
        // Update the current state and use local storage to save the current user
        // This decreases the loading time as we don't wait for firebase
        // If null is passed, we set authUser as null
        authUser => {
          if (!authUser) {
            // No user logged in - no store
            this.setState({ currentStore: null });
          } else {
            // User logged in, try to retrieve store
            // Fetch the store that the authed user is in charge of
            const component = this
            const firebase = this.props.firebase
            const uid = authUser.uid
            /**
             * Attempt to get the store IDs using the vendor object from firebase
             */
            firebase.getStoreIdsForVendor(uid)
                    .then(function(stores) {
                      console.log("Vendor object found successfully")
                      // We only support one store for now, so get the first element or null
                      if (stores.length > 0) {
                        const storeId = stores[0];
                        // Now try to retrieve the store object
                        firebase.getStoreWithId(storeId)
                                .then(function(retrievedStore) {
                                  console.log("Store retrieved successfully")
                                  component.setState({
                                    loadingStore: false,
                                    currentStore: retrievedStore
                                  })
                                })
                                .catch(function(error) {
                                  console.error("Getting store failed. Probably because it does not exist: " + error)
                                  component.setState({
                                    loadingStore: false,
                                    currentStore: null
                                  })
                                })
                      } else {
                        // Vendor has no store yet
                        component.setState({
                          loadingStore: false,
                          currentStore: null
                        })
                      }
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
                                    loadingStore: false,
                                    currentStore: null
                                  });
                                })
                                .catch(function(error) {
                                  console.error("Vendor object was not created and recreating failed. Reloading page");
                                  window.location.reload();
                                })
                        }
                    });
            }
          },
          // Error case where no authUser is given
          () => {
            this.setState({ currentStore: null });
          },
      );
    }

    // To avoid performance issues, remove listener when component unmounts
    componentWillUnmount() {
      this.listener();
    }

    // Render the component bundled with the store value
    render() {
      return (
        <StoreUserContext.Provider value={this.state.currentStore}>
          <Component currentStore={this.state.currentStore} loadingStore={this.state.loadingStore} {...this.props} />
        </StoreUserContext.Provider>
      );
    }
  }

  return withFirebase(WithStoreBase);
};

export default WithStore;