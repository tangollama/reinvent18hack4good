import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Nodinatim from 'nodinatim'

export default class LookupAddress extends Component {

    static propTypes = {
        label: PropTypes.string,
        lookup_callback: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.label = props.label != null ? props.label : 'Lookup Address'
        this.state = {
            address: null
        }
        this.working = null
    }

    lookupAddress() {
        if (this.working == null || this.working.length == 0) {
            return
        }
        const geocoder = new Nodinatim(); // Can include self-hosted nominatim server in instantiation. Defaults to https://nominatim.openstreetmap.org/
    
        geocoder.geocode(this.working).then((results) => {
            if (results.latitude && results.longitude) {
                this.props.lookup_callback(results.latitude, results.longitude)
            } else {
                alert("No coordinates found for " + this.props.address)
            }
        }, (/*error*/) => {
            //console.error(error)
            alert("No coordinates found for " + this.props.address)
        })
    }

    render() {
        return (
            <div className="lookupAddressContainer">
                <input type="text" 
                    className="lookupAddressInput"
                    value={this.state.address} 
                    placeholder={this.label} 
                    onChange={evt => { this.working = evt.target.value }}
                />
                <button
                    className="ConfigModal-Button-Left"
                    onClick={() => this.lookupAddress() }
                >{this.label}</button>
            </div>
        )
    }
}

