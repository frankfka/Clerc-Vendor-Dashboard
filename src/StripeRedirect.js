import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// This is for dev-only, specify correct backend URL for deployment
const CLERC_CREATE_ACCOUNT_URL = "/vendors/connect-standard-account"

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
            body: JSON.stringify(createAcctData)
        }).then(function(response) {
            // Push to SetupResult with a success bool
            let success = false
            console.log(response) // TODO remove in prod
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
                <div>
                    <h1>Success</h1>
                    <Form
                    onSubmit={e => this.handleSubmit(e, this.vendorNameInput.current.value, authCode, this.props.history)}>
                    <Form.Row>
                        <Form.Group>
                            <Form.Label>Store Name</Form.Label>
                            <Form.Control 
                                ref={this.vendorNameInput}
                                type="text"
                                placeholder="Enter a store name"
                                required/>
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    </Form>
                </div>
            )
        } else {
            // Show error
            return (
                <div>
                    <h2>Stripe Not Connected</h2>
                    <p>Something went wrong. To try again, please go back to Vendor Setup</p>
                    <Link to="/setup"><div>Vendor Setup</div></Link>
                </div>
            )
        }
    }
}

export default StripeRedirect