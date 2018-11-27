import React, { Component } from 'react'
import './App.scss'
import OpportunityMap from './components/OpportunityMap'
import {BounceLoader} from 'react-spinners'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.callbacks = {}
    this.center = [36.114647, -115.172813]
    this.state = {
      locationId: -1,
      locations: null
    }
  }

  render() {
    if (this.state.locations) {
      return (
        <div className="gwcApp">
          <OpportunityMap 
                          callbacks={this.callbacks}
                          center={this.center}
                          className="mapPane"
                          ref={(ref) => this.mapRef = ref}
                          locationId={this.state.locationId}
                          locations={this.state.locations}
                          {...this.props}
                      />   
        </div>
      )  
    } else {
      return (
        <div className="gwcApp">
          <BounceLoader className="centered" />
        </div>        
      )
    }
  }
}