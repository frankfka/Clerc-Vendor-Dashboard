import React, {Component} from 'react';

import { withFirebase } from '../Firebase';
import Loading from '../Standard/Loading';

import './index.scss'

class ProductTableBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      store: this.props.store,
      loading: true,
      products: []
    };
  }

  render() {
    
  }

  // Retrieve first 10 products on component mount
  componentDidMount() {


    if (store) {
        const firebase = this.props.firebase
        this.props.firebase.getProductsForStore(store.id)
        .then(function(result){
          console.log(result.products)
          firebase.getProductsForStore(store.id, undefined, result.lastVisible)
          .then(function(result) {
            console.log(result)
          })
        }).catch (function(error) {
          console.log(error)
        })
      }
  }

}

const ProductsTable = compose(
  withFirebase
  )(ProductTableBase);

export default ProductsTable;