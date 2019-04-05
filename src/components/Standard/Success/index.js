import React from 'react';

import Alert from 'react-bootstrap/Alert'

const SuccessHint = ({message}) => (
    <div>
        <Alert variant='success'>
            {message}
        </Alert>
    </div>
);

export default SuccessHint;