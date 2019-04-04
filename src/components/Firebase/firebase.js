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

}

export default Firebase;