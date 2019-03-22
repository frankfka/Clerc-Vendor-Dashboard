import React, { Component } from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import Link from 'react-router-dom/Link'

class SetupResult extends Component {
    render() {

        // Redirect back to setup if state is not given
        // if (!this.props.location.state) {
        //     this.props.history.push({
        //         pathname: '/setup/'
        //     })
        // }

        let stripeConnectionSucceeded = false//this.props.location.state.success

        console.log(stripeConnectionSucceeded)
            if (stripeConnectionSucceeded) {
                return (
                    <Container className="main-container">
                        <Row className="div-with-bottom-space">
                            <Col xs={{span: 6, offset: 3}} className="centered">
                            <img src={require('../img/success.svg')} alt="" className="decorative-img"/>
                            </Col>
                        </Row>
                        <Row>
                            <div className="centered">
                            <h1>Success!</h1>
                            <p>All done. We'll be in touch shortly.</p>
                            </div>
                        </Row>
                    </Container>
                );
            } else {
                return (
                    <Container className="main-container">
                        <Row className="div-with-bottom-space">
                            <Col xs={{span: 6, offset: 3}} className="centered">
                            <img src={require('../img/fail.svg')} alt="" className="decorative-img"/>
                            </Col>
                        </Row>
                        <Row>
                            <div className="centered">
                                <div className="div-with-bottom-space">
                                    <h1>Something Went Wrong.</h1>
                                    <p>Your store was not connected successfully. Please try again, or contact us for assistance.</p>
                                </div>
                                <Link to="/setup"><Button className="primary-btn">Vendor Setup</Button></Link>
                            </div>
                        </Row>
                    </Container>
                );
            }
    }
}

export default SetupResult