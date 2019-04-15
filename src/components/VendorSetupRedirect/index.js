import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ErrorHint from '../Standard/Error';

import * as ROUTES from '../../constants/routes'
import './index.scss'
import { withAuthentication, withAuthorization } from '../Session';

// const CLERC_CREATE_ACCOUNT_URL = "http://localhost:4567/vendors/connect-standard-account"
const CLERC_CREATE_ACCOUNT_URL = "https://paywithclerc.appspot.com/vendors/connect-standard-account"

// Define an initial state
const INITIAL_STATE = {
    storeName: '',
    error: null
};

class StripeRedirectBase extends Component {

    constructor(props) {
        super(props);
        // Init state with the initial values
        this.state = {
            ...INITIAL_STATE,
            authUser: this.props.authUser, // Never null
        };
    }

    // Event handler for submit button
    onSubmit = (event, authCode) => {
        
        // Prevent browser reload
        event.preventDefault();
        const component = this;

        let createAcctData = {
            account_auth_code: authCode,
            store_name: this.state.storeName,
            vendor_id: this.state.authUser.uid
        }
        // Form is valid, post the parameters
        fetch(CLERC_CREATE_ACCOUNT_URL, {
            method: 'post',
            headers: {'Access-Control-Allow-Origin':'*'},
            body: JSON.stringify(createAcctData)
        }).then(function(response) {
            console.log(response)
            // Push to home when successful
            if (response.status === 201) {
                component.props.history.push(ROUTES.HOME)
            } else {
                // propagate error state
                component.setState({error: true});
            }
        }).catch(function(error) {
            console.log("Error making call to create store " + error)
            // propagate error state
            component.setState({error: true});
        })
    }

    // On form change, we update the current state
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {

        // Get the authorization code from the query string
        const queryParser = require('query-string');
        const queries = queryParser.parse(this.props.location.search);
        let authCode = queries.code;

        // Get current state for the form & check validity
        const { storeName, error } = this.state
        const isInvalid = storeName === ''
        
        if (authCode) {
            // Successfully retrieve code, load final form
            return (
                <Container className="body-container">
                    <Row>
                    <Col md={6}>
                        <img src={require('./success.svg')} alt="" className="redirect-decorative-img"/>
                    </Col>
                    <Col md={6}>
                        <h3>Stripe Connected Successfully!</h3>
                        <p>Thank you for connecting your Stripe account. We just need 
                            your store name to finish connecting your account. This will be shown
                            in the mobile app to your customers. We'll be in touch after you submit to 
                            collect product information.
                        </p>
                        <Form
                            onSubmit={e => this.onSubmit(e, authCode)}
                        >
                            <Form.Group>
                                <Form.Label><strong>Store Name</strong></Form.Label>
                                <Form.Control 
                                    name="storeName"
                                    value={storeName}
                                    type="text"
                                    placeholder="Enter a store name"
                                    onChange={this.onChange}
                                    required/>
                            </Form.Group>
                            <Button type="submit" className="btn-primary" disabled={isInvalid}>
                                Submit
                            </Button>
                        </Form>
                        {error && <div className="stripe-redirect-error-hint"><ErrorHint message="Something went wrong. Please try again"/></div>}
                    </Col>
                    </Row>
                </Container>
            )
        } else {
            // Show error
            return (
                <Container className="body-container">
                    <Row>
                        <Col md={6} className="centered">
                            <img src={require('./fail.svg')} alt="" className="redirect-decorative-img"/>
                        </Col>
                        <Col md={6}>
                            <div>
                                <h1>Uh-Oh.</h1>
                                <p>Something went wrong. Your Stripe account was not connected. Please try again.</p>
                            </div>
                            <Link to={ROUTES.HOME}><Button className="btn-primary">Back to Home</Button></Link>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}

const isSignedIn = authUser => !!authUser;
const StripeRedirect = compose(
  withAuthentication,
  withAuthorization(isSignedIn)
  )(StripeRedirectBase);

export default StripeRedirect