import React, { Component } from 'react';

// Development client ID
const STRIPE_CLIENT_ID = "ca_Ei8zXIprPLyN7VGgnJ8h08rFqDZOROgZ"
const STRIPE_CONNECT_URL = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`

class SetupStart extends Component {
    render() {
        return (
            <div>
            <h2>Setup</h2>
            <a href={STRIPE_CONNECT_URL} target="_blank" rel="noopener noreferrer">Connect To Stripe</a>
            </div>
        );
    }
}

export default SetupStart