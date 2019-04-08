import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './index.scss'

class DeleteProductModal extends Component {
    
    render() {

        const { deleteConfirmed, onHide, show } = this.props

        return(
            <Modal
                onHide={onHide}
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="delete-product-modal-body">
                <h3>Delete Product</h3>
                <p>
                    Are you sure you want to delete this product? This cannot be undone.
                </p>
                </Modal.Body>
                <Modal.Footer>
                <Button className="btn-primary" onClick={onHide}>Cancel</Button>
                <Button variant="danger" onClick={deleteConfirmed}>Delete</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

export default DeleteProductModal;