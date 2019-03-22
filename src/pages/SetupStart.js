import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

// Development client ID
const STRIPE_CLIENT_ID = "ca_Ei8zXIprPLyN7VGgnJ8h08rFqDZOROgZ"
const STRIPE_CONNECT_URL = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`

class SetupStart extends Component {
    render() {
        return (
            <Container className="main-container">
            <Row>
                <Col xs={12} md={6}>
                <div className="div-with-bottom-space">
                    <h1>New Store Setup</h1>
                    <h6 className="primary-text">Clerc | Mobile Checkout</h6>
                </div>
                <div className="div-with-bottom-space">
                    <p>Now that you're ready to set up your store with Clerc, we'll need to connect your store with Stripe. 
                        Stripe lets us collect payments without handling sensitive customer information, 
                        allowing us to create a <strong>safe and secure</strong> service. Afterwards, you'll be redirected back to 
                        the setup page to finish connecting your store.
                    </p>
                </div>
                <Button 
                    href={STRIPE_CONNECT_URL}
                    className="primary-btn"
                    target="_blank"
                    rel="noopener noreferrer">
                    Connect With Stripe
                </Button>
                </Col>
                <Col xs={12} md={6} className="centered">
                    <img src={require('../img/setup.svg')} alt="" className="decorative-img"/>
                </Col>
            </Row>
            </Container>
        );
    }
}

export default SetupStart