import React, {Component} from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import Pagination from 'react-bootstrap/Pagination'
import Loading from '../Standard/Loading';
import Table from 'react-bootstrap/Table';

import './index.scss'

// Default # items in table
const DEFAULT_TABLE_SIZE = 10
// Loading state with no products
const DEFAULT_STATE = {
  loading: true,
  products: [],
  currentPage: 1,
  isLastPage: false,
  firstVisibleProduct: null, // Used to paginate
  lastVisibleProduct: null // Used to paginate
};

// Loading animation when table is in loading state
const tableLoading = (height) => (
  <tbody className="table-loading-tbody" style={{height: height + 'px'}}>
    <tr><td colSpan="3" className="table-loading-td"><div><Loading doFadeIn={false}/></div></td></tr>
  </tbody>
)

class ProductTableBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
      store: this.props.store,
      rowClicked: this.props.rowClicked,
      numPerPage: DEFAULT_TABLE_SIZE
    };
  }

  // Logic to get products for previous page
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
                component.updateState(false, result.products, result.firstVisible,
                                      result.lastVisible, currentPage - 1, result.products.length < numPerPage);
              }).catch(function(error) {
                console.log("Error getting next page: " + error)
              })
    }
  }

  // Logic to get products for next day
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

    const { products, currentPage, isLastPage, loading, numPerPage, rowClicked } = this.state;
    const disablePrevPagination = (currentPage === 1) || loading;
    const disableNextPagination = isLastPage || loading || products.length < numPerPage;
    // Calculate the height of the loading state
    const loadingTableHeight = numPerPage * 25;

    return (
      <div>
        <Table className="products-table">
        <thead>
          <tr>
            <th width="40%">Item</th>
            <th width="20%">Unit Cost</th>
            <th width="40%">Identifier</th>
          </tr>
        </thead>

        { loading ? tableLoading(loadingTableHeight) : 
          <tbody>
            {products.map(product => (
              <tr key={product.id} onClick={rowClicked ? () => rowClicked(product) : null}>
                <td>{product.name}</td>
                <td>$ {product.cost.toFixed(2)}</td>
                <td>{product.id}</td>
              </tr>
            ))}
          </tbody>
        }
        </Table>
        <Pagination className="products-table-pagination">
          <Pagination.Prev onClick={this.getPreviousPage} disabled={disablePrevPagination}/>
          <Pagination.Next onClick={this.getNextPage} disabled={disableNextPagination}/>
        </Pagination>
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