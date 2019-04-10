import React from 'react';

import Alert from 'react-bootstrap/Alert'

const ErrorHint = ({message}) => (
    <div>
        <Alert variant='danger' dismissible>
            {message}
        </Alert>
    </div>
);

export default ErrorHint;