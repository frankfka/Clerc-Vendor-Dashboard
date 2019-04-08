import app from 'firebase/app';

import 'firebase/auth'
import 'firebase/firestore'

import * as FIRESTORE from '../../constants/firestore'
import * as ERROR from '../../constants/errors'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {

    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    /**
     * Authentication methods
     */
    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    /**
     * Firestore methods
     */

    // Creates a vendor in firestore
    doCreateVendor = (uid) => {
      const firestore = this.db
      return new Promise(function(resolve, reject) {
        firestore.collection(FIRESTORE.VENDOR_COLLECTION)
        .doc(uid)
        .set({[FIRESTORE.VENDOR_STORES_PROP]: []})
        .then(function() {
          resolve({
            message: "Document added"
          })
        })
        .catch(function(error) {
          reject(error)
        });
      })
    }

    // Retrieves the stores for the vendor. 
    // Throws error if vendor object does not exist
    getStoreIdsForVendor = (uid) => {
      const firestore = this.db
      return new Promise(function(resolve, reject) {
        firestore.collection(FIRESTORE.VENDOR_COLLECTION).doc(uid).get().then(function(doc) {
          if (doc.exists) {
            // Vendor doc exists, get store info
            const data = doc.data()
            resolve(data[FIRESTORE.VENDOR_STORES_PROP])
          } else {
            reject({
              message: ERROR.VENDOR_DNE
            })
          }
        })
      })
    }

    // Retrieves the store object given the ID
    getStoreWithId = (storeId) => {
      const firestore = this.db
      return new Promise(function(resolve, reject) {
        firestore.collection(FIRESTORE.STORE_COLLECTION).doc(storeId).get().then(function(doc) {
          if (doc.exists) {
            // Vendor doc exists, get store info
            const data = doc.data()
            // Build our own data structure
            const store = {
              id: storeId,
              name: data[FIRESTORE.STORE_NAME_PROP],
              defaultCurrency: data[FIRESTORE.STORE_CURRENCY_PROP],
              parentVendorId: data[FIRESTORE.STORE_PARENT_VENDOR_PROP],
            }
            resolve(store)
          } else {
            reject({
              message: ERROR.STORE_DNE
            })
          }
        })
      })
    }

    // Retrieves first n products (default 10)
    // starting after a given snapshot (if provided)
    // or just before a given snapshot (if provided)
    getProductsForStore = (storeId, numToRetrieve = 10, beforeSnapshot, afterSnapshot) => {
      // Get a reference to the products collection
      const firestore = this.db
      let reference = firestore.collection(FIRESTORE.STORE_COLLECTION)
                               .doc(storeId)
                               .collection(FIRESTORE.PRODUCT_COLLECTION)

      // NOTE: There is a bug in firestore - so to retrieve documents
      // Before a certain snapshot, we reverse the order then use "startAfter"
      // The flip the resulting arrays

      // Complete the reference object
      if (afterSnapshot) {
        reference = reference.orderBy("name")
                             .startAfter(afterSnapshot)
      } else if (beforeSnapshot) {
        reference = reference.orderBy("name", "desc")
                             .startAfter(beforeSnapshot)
      } else {
        reference = reference.orderBy("name")
      }
      reference = reference.limit(numToRetrieve)

      // Create a promise to return
      return new Promise(function(resolve, reject) {
        // Get the documents from the refernece
        reference.get()
                 .then(function(querySnapshot) {

                  let productsToReturn = []
                  // Add each document to the list of products
                  querySnapshot.forEach(function(doc) {
                    // TODO: We could formalize this in a class
                    const docData = doc.data()
                    productsToReturn.push({
                      id: doc.id,
                      name: docData[FIRESTORE.PRODUCT_NAME_PROP],
                      currency: docData[FIRESTORE.PRODUCT_CURRENCY_PROP],
                      cost: docData[FIRESTORE.PRODUCT_COST_PROP]
                    })
                  });

                  // We also need references for future pagination
                  let firstVisible = null;
                  let lastVisible = null;
                  if (querySnapshot.docs.length !== 0) {
                    // Flip references / products if we're going to previous page
                    if (beforeSnapshot) {
                      productsToReturn.reverse();
                      firstVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                      lastVisible = querySnapshot.docs[0];
                    } else {
                      firstVisible = querySnapshot.docs[0];
                      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                    }
                  }
                  
                  // Return the list & the first/last snapshots for future pagination
                  resolve({
                    products: productsToReturn,
                    firstVisible: firstVisible,
                    lastVisible: lastVisible
                  })
                })
                .catch(function(error) {
                  console.log("Error getting products: " + error)
                  reject(error)
                })
      })
    }

    // Creates a product in firestore
    createProduct = (id, name, cost) => {
      
    }

    // Updates a product in firestore
    updateProduct = (id, newName, newCost) => {
      
    }

    // Deletes a product in firestore
    deleteProduct = (id) => {

    }

}

export default Firebase;