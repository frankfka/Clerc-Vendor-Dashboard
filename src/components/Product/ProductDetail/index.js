import React, {Component} from 'react';

import { withAuthorization, withStore } from '../../Session';
import * as ROUTES from '../../../constants/routes'
import ProductBarcode from '../ProductBarcode'
import DeleteProductModal from '../DeleteProductModal'

import './index.scss'

import Container from 'react-bootstrap/Container';
import { compose } from 'recompose'
import Button from 'react-bootstrap/Button'
import { BackToHomeLink } from '../../Home';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class ProductDetailBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        product: this.props.location.state ? this.props.location.state.product : null,
        editedName: this.props.location.state ? this.props.location.state.product.name : null,
        editedCost: this.props.location.state ? this.props.location.state.product.cost : null,
        isEditing: false,
        showGeneratedBarcode: false,
        showDeleteConfirmation: false,
    };
    this.generatedBarcodeRef = React.createRef();
  }

    // Navigate back if props aren't passed
    componentDidMount() {
        if (!this.state.product) {
            // Reroute to home
            this.props.history.push(ROUTES.HOME);
        }
    }

    // Change state to show barcode
    showHideBarcodePressed = () => {
        this.setState(prevState => ({
            showGeneratedBarcode: !prevState.showGeneratedBarcode
        }));
    }

    // Do what's necessary to save the product
    saveButtonPressed = () => {
        const { product, editedName, editedCost } = this.state
        const { currentStore } = this.props
        const editedCostFloat = parseFloat(editedCost).toFixed(2)
        const component = this
        // First disable editing
        this.setState({
            isEditing: false
        })

        // Check valid state
        if (!product || !editedName || !editedCost || !currentStore ) {
            // TODO show error banner
            return
        }

        // Save to firebase
        this.props.firebase.updateProduct(currentStore.id, product.id, editedName, editedCostFloat)
                           .then(function() {
                               // Update state
                                product.name = editedName
                                product.cost = editedCostFloat
                                component.setState({
                                    product: product,
                                    editedName: product.name,
                                    editedCost: product.cost,
                                    isEditing: false
                                })
                                console.log("Success in updating product")
                               // TODO show success banner
                           })
                           .catch(function(error) {
                               // TODO show error banner
                               console.log(error)
                           })
    }

    // Delete the product after prompting for confirmation
    deleteProduct = () => {
        const { product } = this.state
        const { currentStore } = this.props
        const component = this

        // Check valid state
        if (!product || !currentStore ) {
            // TODO show error banner
            return
        }

        // First close the modal
        this.closeDeleteConfirmationModal()
        // Do firebase stuff
        this.props.firebase.deleteProduct(currentStore.id, product.id)
                           .then(function() {
                               // Show success banner
                               component.props.history.push(ROUTES.HOME);
                           })
                           .catch(function(error) {
                               // TODO Show error banner
                               console.log(error)
                           })
    }

    // Methods for dealing with showing/hiding of modal
    closeDeleteConfirmationModal = () => {
        this.setState({showDeleteConfirmation: false})
    }
    showDeleteConfirmationModal = () => {
        this.setState({showDeleteConfirmation: true})
    }

    // Cancel editing
    cancelButtonPressed = () => {
        const originalProduct = this.state.product
        this.setState({
            editedName: originalProduct.name,
            editedCost: originalProduct.cost,
            isEditing: false
        })
    }

    // Fired on form change (during editing)
    formEdited = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Change state to editing mode
    editProductPressed = () => {
        this.setState({
            isEditing: true
        })
    }
    
    render() {

    // Always initialized (otherwise we should navigate back)
    const { product, editedCost, editedName, isEditing, showDeleteConfirmation } = this.state

    // Form validation - we impose a 50char limit for now
    const isInvalid = editedName === '' || editedName.length > 50 ||
                        editedCost === '' || isNaN(editedCost) || parseFloat(editedCost) <= 0

    if (product) {
        return (
            <Container fluid className="body-container">

                <DeleteProductModal
                    show={showDeleteConfirmation}
                    onHide={this.closeDeleteConfirmationModal}
                    deleteConfirmed={this.deleteProduct}/>

                <BackToHomeLink/>
                <div className="product-detail-section">
                    <div className="product-detail-header">
                        <h1>Product Detail</h1>
                        <h5><strong>Barcode ID:</strong> {product.id}</h5>
                        <span className="product-generate-barcode-button"
                            onClick={this.showHideBarcodePressed}>
                            View/Hide Barcode
                        </span>
                        <div className="product-detail-generated-barcode">
                            {
                                this.state.showGeneratedBarcode ? 
                                <ProductBarcode data={product.id}/>
                                : null
                            }
                        </div>
                    </div>
                    <div className="product-detail-form-wrapper">
                        <Form className="product-detail-form">
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                    Item Name <span className="small-text grey-text">(Max 50 Char.)</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control 
                                        name="editedName"
                                        readOnly={!isEditing}
                                        value={editedName}
                                        onChange={this.formEdited}
                                        type="text"
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                    Unit Cost <span className="small-text grey-text">($)</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="editedCost"
                                        readOnly={!isEditing}
                                        value={editedCost}
                                        onChange={this.formEdited}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                        <div className="product-detail-form-buttons">
                            {isEditing ?
                                <div>
                                    <Button onClick={this.cancelButtonPressed}
                                            variant="outline-primary"
                                            className="mx-1">Cancel</Button>
                                    <Button onClick={this.saveButtonPressed}
                                            disabled={isInvalid}
                                            className="mx-1">Save</Button>
                                </div>
                                :
                                <Button onClick={this.editProductPressed}>Edit</Button>
                            }
                        </div>
                        <div className="product-detail-delete-button-container">
                            <span className="product-detail-delete-button"
                                        onClick={this.showDeleteConfirmationModal}>Delete Product</span>
                        </div>
                    </div>
                </div>
            </Container>
        )
        } else {
            // Show some error page
            return (
                <div>

                </div>
            )
        }
    }

}

const isSignedIn = authUser => !!authUser;
const ProductDetail = compose(
  withAuthorization(isSignedIn),
  withStore
  )(ProductDetailBase);

export default ProductDetail;