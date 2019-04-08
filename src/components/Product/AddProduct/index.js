import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { withAuthorization } from '../../Session';
import * as ROUTES from '../../../constants/routes'

import './index.scss'

import Container from 'react-bootstrap/Container';
import { compose } from 'recompose'
import Button from 'react-bootstrap/Button'
import { BackToHomeLink } from '../../Home';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Standard add product button
export const AddProductButton = () => (
    <Button><Link to={ROUTES.ADD_PRODUCT}>Add Product</Link></Button>
);

// Default state for the form
const DEFAULT_STATE = {
    id: '',
    name: '',
    cost: '',
    autogenerateId: false,
}

class AddProductBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        ...DEFAULT_STATE
    };

  }

    // Add the product to firestore
    saveButtonPressed = () => {
        // Save to firebase
        // Show a banner or something? https://github.com/schiehll/react-alert#readme
        // Redirect to home
    }

    // Cancel editing
    cancelButtonPressed = () => {
        // Show an alert
        // Redirect to home
    }

    // Fired on form change (during editing)
    formEdited = (event) => {
        // Separate logic required for checkbox
        if (event.target.name === "autogenerateId") {
            // Also clear whatever is in barcode ID
            this.setState({ autogenerateId: event.target.checked, id: "" })
        } else {
            this.setState({ [event.target.name]: event.target.value });
        }
    }

    render() {

    // Always initialized (otherwise we should navigate back)
    const { id, name, cost, autogenerateId } = this.state

    // Form validation - we impose a 50char limit for now
    const isInvalid = name === '' || name.length > 50 || // Name validation
                        cost === '' || isNaN(cost) || parseFloat(cost) <= 0 || // Cost validation
                        (!autogenerateId && id==='') // id validation

    return (
        <Container fluid className="body-container">

            <BackToHomeLink/>
            <div className="add-product-section">
                <h1 className="centered">New Product</h1>
                <div className="add-product-form-wrapper">
                    <Form className="add-product-form">

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">
                                Product Name <span className="small-text grey-text">(Max 50 Char.)</span>
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control 
                                    name="name"
                                    value={name}
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
                                    name="cost"
                                    value={cost}
                                    onChange={this.formEdited}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">
                                Barcode ID
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="id"
                                    value={id}
                                    disabled={autogenerateId}
                                    onChange={this.formEdited}
                                    type="text"
                                />
                                <p className="small-text my-1 mb-2">UPC/EAN identifier, or your own ID for the barcode</p>
                                <Form.Check 
                                    type="checkbox"
                                    id="autogenerateId"
                                    name="autogenerateId"
                                    label="Automatically Generate Barcode ID"
                                    onChange={this.formEdited}
                                />
                            </Col>
                        </Form.Group>

                    </Form>
                    
                    <div className="add-product-form-buttons">
                        <Button onClick={this.cancelButtonPressed}
                                variant="outline-primary"
                                className="mx-1">Cancel</Button>
                        <Button onClick={this.saveButtonPressed}
                                disabled={isInvalid}
                                className="mx-1">Save</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
    }

}

const isSignedIn = authUser => !!authUser;
const AddProduct = compose(
  withAuthorization(isSignedIn),
  )(AddProductBase);

export default AddProduct;