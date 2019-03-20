import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class StripeRedirect extends Component {

    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.vendorNameInput = React.createRef();
      }

    // Event handler for submit button
    handleSubmit(event, storeName) {
        event.preventDefault()

        // Get form and check its validity
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }

        console.log("proceed")

        console.log(storeName);

    }

    render() {

        const queryParser = require('query-string');
        const queries = queryParser.parse(this.props.location.search);
        
        if (queries.code) {
            // Successfully retrieve code, load final form
            return (
                <div>
                    <h1>Success</h1>
                    <Form
                    onSubmit={e => this.handleSubmit(e, this.vendorNameInput.current.value)}>
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