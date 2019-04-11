import React from 'react';

import Alert from 'react-bootstrap/Alert'

const SuccessHint = ({message}) => (
    <div>
        <Alert variant='success' dismissible>
            {message}
        </Alert>
    </div>
);

export default SuccessHint;