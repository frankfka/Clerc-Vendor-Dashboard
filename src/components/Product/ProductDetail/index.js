import React, {Component} from 'react';

import { withAuthorization } from '../../Session';
import * as ROUTES from '../../../constants/routes'
import ProductBarcode from '../ProductBarcode'

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
        // TODO do firebase stuff
        const originalProduct = this.state.product
        originalProduct.name = this.state.editedName
        originalProduct.cost = parseFloat(this.state.editedCost).toFixed(2)
        this.setState({
            product: originalProduct,
            editedName: originalProduct.name,
            editedCost: originalProduct.cost,
            isEditing: false
        })
    }

    // Delete the product after prompting for confirmation
    deleteButtonPressed = () => {
        console.log("Delete!!!")
        // Show dialog
        // Do firebase stuff
        // Navigate back to home page

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
    const { product, editedCost, editedName, isEditing } = this.state

    // Form validation - we impose a 200char limit for now
    const isInvalid = editedName === '' || editedName.length > 200 ||
                        editedCost === '' || isNaN(editedCost) || parseFloat(editedCost) <= 0

    if (product) {
        return (
            <Container fluid className="body-container">
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
                                    Item Name
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
                                    Unit Cost ($)
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
                                        onClick={this.deleteButtonPressed}>Delete Product</span>
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
  )(ProductDetailBase);

export default ProductDetail;