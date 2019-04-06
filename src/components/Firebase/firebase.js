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

    // Retrieves first n products
    // starting after a given snapshot (if provided)
    // or just before a given snapshot (if provided)
    // Or just retrieves the first n products (default 10)
    getProductsForStore = (storeId, numToRetrieve = 10, beforeSnapshot, afterSnapshot) => {
      const firestore = this.db
      let reference = firestore.collection(FIRESTORE.STORE_COLLECTION)
                               .doc(storeId)
                               .collection(FIRESTORE.PRODUCT_COLLECTION)

      // Add retrieve after a given snapshot (if provided)
      if (afterSnapshot) {
        reference = reference.startAfter(afterSnapshot)
      }
      // Or retrieve before a given snapshot (if provided)
      else if (beforeSnapshot) {
        reference = reference.endBefore(beforeSnapshot)
      }

      reference = reference.limit(numToRetrieve)
      return new Promise(function(resolve, reject) {
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
                    // Return the list & the first/last snapshots for future pagination
                    resolve({
                      products: productsToReturn,
                      firstVisible: querySnapshot.docs.length !== 0 ? querySnapshot.docs[0] : null,
                      lastVisible: querySnapshot.docs.length !== 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
                    })
                  })
                  .catch(function(error) {
                    console.log("Error getting products: " + error)
                    reject(error)
                  })
      })
    }

}

export default Firebase;