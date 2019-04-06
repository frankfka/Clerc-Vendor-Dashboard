import React, {Component} from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import Pagination from 'react-bootstrap/Pagination'
import Loading from '../Standard/Loading';
import Table from 'react-bootstrap/Table'

import './index.scss'

// Default # items in table
const DEFAULT_TABLE_SIZE = 1
// Loading state with no products
const DEFAULT_STATE = {
  loading: true,
  products: [],
  currentPage: 1,
  isLastPage: false,
  firstVisibleProduct: null, // Used to paginate
  lastVisibleProduct: null // Used to paginate
};

class ProductTableBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
      store: this.props.store,
      numPerPage: DEFAULT_TABLE_SIZE
    };
  }

  getPreviousPage = () => {
    const component = this;
    const { firebase } = this.props
    const { firstVisibleProduct, store, numPerPage, currentPage } = this.state

    // Check that last visible is non-null
    if (firstVisibleProduct != null) {
      // Set State
      this.setState({
        loading: true
      })
      // check that last visible is not null
      firebase.getProductsForStore(store.id, numPerPage, firstVisibleProduct, undefined)
              .then(function(result) {
                // Only update state if we have products to fill the table with
                if(result.products.length !== 0) {
                  component.updateState(false, result.products, result.firstVisible,
                                        result.lastVisible, currentPage - 1, result.products.length < numPerPage);
                } else {
                  console.log("Previous products list is empty")
                }
              }).catch(function(error) {
                console.log("Error getting next page: " + error)
              })
    }
  }

  getNextPage = () => {
    const component = this;
    const { firebase } = this.props
    const { lastVisibleProduct, store, numPerPage, currentPage } = this.state

    // Check that last visible is non-null
    if (lastVisibleProduct != null) {
      // Set State
      this.setState({
        loading: true,
      })
      // check that last visible is not null
      firebase.getProductsForStore(store.id, numPerPage, undefined, lastVisibleProduct)
              .then(function(result) {
                // if the next page is empty, do nothing and indicate that it is the last page
                if (result.products.length === 0) {
                  console.log("Reached last page")
                  component.setState({
                    isLastPage: true,
                    loading: false
                  })
                } else {
                  // Only if the next page is NOT empty do we update the state
                  component.updateState(false, result.products, result.firstVisible, 
                    result.lastVisible, currentPage + 1, result.products.length < numPerPage);
                }
              }).catch(function(error) {
                console.log("Error getting next page: " + error)
              })
    }
  }

  logState = () => {
    console.log(this.state)
  }

  // Updates the state given the required variables
  updateState = (loading, products, firstVisible, lastVisible, currentPage, isLastPage) => {
    this.setState({
      loading: loading,
      products: products,
      firstVisibleProduct: firstVisible,
      lastVisibleProduct: lastVisible,
      currentPage: currentPage,
      isLastPage: isLastPage
    })
  }

  // Build the component
  render() {

    const { products, currentPage, isLastPage } = this.state
    const disablePagination = false;
    // Check to disable/enable prev/next 
    return (
      <div>
        <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
            </tr>
          ))}
        </tbody>
        </Table>
        <Pagination.Prev onClick={this.getPreviousPage} disabled={currentPage === 1}/>
        <Pagination.First onClick={this.logState}/>
        <Pagination.Next onClick={this.getNextPage} disabled={isLastPage}/>
      </div>
    )
  }

  // Retrieve first 10 products on component mount
  componentDidMount() {

    const { store, numPerPage } = this.state
    const { firebase } = this.props
    const component = this

    firebase.getProductsForStore(store.id, numPerPage)
            .then(function(result) {
              component.setState({
                loading: false,
                products: result.products,
                firstVisibleProduct: result.firstVisible,
                lastVisibleProduct: result.lastVisible
              })
            })
            .catch (function(error) {
              console.log("Error getting products initially: " + error)
              component.setState({
                loading: false
              })
            })
  }

}

const ProductsTable = compose(
  withFirebase
  )(ProductTableBase);

export default ProductsTable;