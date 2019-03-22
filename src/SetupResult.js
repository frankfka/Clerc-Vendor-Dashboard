import React, { Component } from 'react';

class SetupResult extends Component {
    render() {

        let stripeConnectionSucceeded = true//this.props.location.state.success

        console.log(stripeConnectionSucceeded)
            if (stripeConnectionSucceeded) {
                return (
                    <div>
                        <h2>Succeess!</h2>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h2>Fail!</h2>
                    </div>
                );
            }
    }
}

export default SetupResult