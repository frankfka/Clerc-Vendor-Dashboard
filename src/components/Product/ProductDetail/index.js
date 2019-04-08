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
        editedProduct: this.props.location.state ? this.props.location.state.product : null,
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
        const newModifiedProduct = this.state.editedProduct
        this.setState({
            product: newModifiedProduct,
            isEditing: false
        })
    }

    // Delete the product after prompting for confirmation
    deleteButtonPressed = () => {
        // Show dialog
        // Do firebase stuff
        // Navigate back to home page

    }

    // Cancel editing
    cancelButtonPressed = () => {
        const originalProduct = this.state.product
        this.setState({
            editedProduct: originalProduct,
            isEditing: false
        })
    }

    // Fired on form change (during editing)
    formEdited = (event) => {
        const editedProduct = this.state.editedProduct
        editedProduct[event.target.name] = event.target.value
        console.log(editedProduct)
        this.setState({ editedProduct: editedProduct });
    }

    // Change state to editing mode
    editProductPressed = () => {
        this.setState({
            isEditing: true
        })
    }
    
    render() {

    // Always initialized (otherwise we should navigate back)
    const { product, editedProduct, isEditing } = this.state

    // TODO form validation
    

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
                                        name="name"
                                        readOnly={!isEditing}
                                        value={editedProduct.name}
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
                                        name="cost"
                                        readOnly={!isEditing}
                                        value={editedProduct.cost}
                                        onChange={this.formEdited}
                                        type="number"
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
                                            className="mx-1">Save</Button>
                                </div>
                                :
                                <Button onClick={this.editProductPressed}>Edit</Button>
                            }
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