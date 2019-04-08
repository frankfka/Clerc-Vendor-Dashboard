import React, {Component} from 'react';

import './index.scss'

import Barcode from 'react-barcode'

// Default config for barcode - we can change this up later
const barcodeConfig = {
    width: 1,
    height: 75,
    format: "CODE128",
    displayValue: false,
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

class ProductBarcode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
        this.generatedBarcodeRef = React.createRef();
    }

    // Get barcode image for download
    saveBarcodeImagePressed = (ref) => {
        var saveSvg = require('save-svg-as-png')
        saveSvg.saveSvgAsPng(ref, "barcode.png");
    }
    
    render() {

        const { data } = this.state;

        return (
            <div 
                onClick={() => {this.saveBarcodeImagePressed(this.generatedBarcodeRef.current.refs.renderElement)}}
                className="generated-product-barcode"
                >
                <Barcode
                    ref={this.generatedBarcodeRef}
                    value={data}
                    {...barcodeConfig}
                />
                <p>(Click to Download)</p>
            </div>
        )

    }

}

export default ProductBarcode;