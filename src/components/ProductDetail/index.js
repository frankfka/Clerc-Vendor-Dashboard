import React, {Component} from 'react';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes'

import './index.scss'

import Container from 'react-bootstrap/Container';
import { compose } from 'recompose'
import Button from 'react-bootstrap/Button'
import Barcode from 'react-barcode'

// Default config for barcode - we can change this up later
const barcodeConfig = {
    width: 2,
    height: 100,
    format: "CODE128",
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10
}

class ProductDetailBase extends Component {

  constructor(props) {
    super(props);
    this.state = {
        product: this.props.location.state ? this.props.location.state.product : null,
        doGenerateBarcode: false
    };
    this.generatedBarcodeRef = React.createRef();
  }

    // Navigate back if props aren't passed
    componentDidMount() {
        if (!this.state.product) {
            // Reroute to home
            this.props.history.push(ROUTES.HOME);
        }
    }

    // Change state to show barcode
    generateBarcodePressed = () => {
        this.setState({
            doGenerateBarcode: true
        })
    }

    // Get barcode image for download
    saveBarcodeImagePressed = (ref) => {
        console.log(ref)
        var saveSvg = require('save-svg-as-png')
        saveSvg.saveSvgAsPng(ref, "barcode.png");
    }
    
    render() {

    // Always initialized (otherwise we should navigate back)
    const { product } = this.state

    if (product) {
        return (
            <Container fluid className="body-container">
                <h1>{product.name}</h1>
                <Button onClick={this.generateBarcodePressed}>Generate Barcode</Button>
                {this.state.doGenerateBarcode ? 
                    <div>
                        <Barcode ref={this.generatedBarcodeRef} value={product.id} {...barcodeConfig} id="generated-product-barcode"/>
                        <Button onClick={() => {this.saveBarcodeImagePressed(this.generatedBarcodeRef.current.refs.renderElement)}}>Download</Button>
                    </div>
                    : null}
            </Container>
        )
        } else {
            // Show some error page
            return (
                <div>

                </div>
            )
        }
    }

}

const isSignedIn = authUser => !!authUser;
const ProductDetail = compose(
  withAuthorization(isSignedIn),
  )(ProductDetailBase);

export default ProductDetail;