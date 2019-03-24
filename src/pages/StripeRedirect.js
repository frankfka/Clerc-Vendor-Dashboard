import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import './css/SetupRedirect.css'

// This is for dev-only, specify correct backend URL for deployment
const CLERC_CREATE_ACCOUNT_URL = "http://34.217.14.89:4567/vendors/connect-standard-account"

class StripeRedirect extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.vendorNameInput = React.createRef();
    }

    // Event handler for submit button
    handleSubmit(event, vendorName, authCode, history) {
        event.preventDefault();

        // Get form and check its validity
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }

        let createAcctData = {
            account_auth_code: authCode,
            vendor_name: vendorName
        }
        // Form is valid, post the parameters
        fetch(CLERC_CREATE_ACCOUNT_URL, {
            method: 'post',
            headers: {'Access-Control-Allow-Origin':'*'},
            body: JSON.stringify(createAcctData)
        }).then(function(response) {
            // Push to SetupResult with a success bool
            let success = false
            if (response.status === 201) {
                console.log("Setup success")
                success = true
            }
            history.push({
                pathname: '/setup/setup-finished',
                state: {success: success}
            })
        })
    }

    render() {

        const queryParser = require('query-string');
        const queries = queryParser.parse(this.props.location.search);
        let authCode = queries.code;
        
        if (authCode) {
            // Successfully retrieve code, load final form
            return (
                <Container className="main-container">
                    <Row>
                    <Col xs={12} md={6}>
                        <img src={require('../img/success.svg')} alt="" className="decorative-img"/>
                    </Col>
                    <Col xs={12} md={6}>
                        <h3>Stripe Connected Successfully!</h3>
                        <p>Thank you for connecting your Stripe account. We just need 
                            your store name to finish connecting your account. This will be shown
                            in the mobile app to your customers. We'll be in touch after you submit to 
                            collect product information.
                        </p>
                        <Form
                            onSubmit={e => this.handleSubmit(e, this.vendorNameInput.current.value, authCode, this.props.history)}
                        >
                            <Form.Row>
                                <Form.Group>
                                    <Form.Label><strong>Store Name</strong></Form.Label>
                                    <Form.Control 
                                        ref={this.vendorNameInput}
                                        type="text"
                                        placeholder="Enter a store name"
                                        required/>
                                </Form.Group>
                            </Form.Row>
                            <Button type="submit" className="primary-btn">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                    </Row>
                </Container>
            )
        } else {
            // Show error
            return (
                <Container className="main-container">
                    <Row>
                        <Col xs={12} md={6} className="centered">
                            <img src={require('../img/fail.svg')} alt="" className="decorative-img"/>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="div-with-bottom-space">
                                <h1>Uh-Oh.</h1>
                                <p>Something went wrong. Your Stripe account was not connected. 
                                    To try setting up your store again, please go back to Store Setup</p>
                            </div>
                            <Link to="/setup"><Button className="primary-btn">Vendor Setup</Button></Link>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

export default StripeRedirect