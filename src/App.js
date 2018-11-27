import React, { Component } from 'react'
import './App.scss'
import OpportunityMap from './components/OpportunityMap'
import LookupAddress from './components/LookupAddress'
import YAML from 'yamljs'
import f from './testdata.yml'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.callbacks = {}
    this.state = {
      locationId: -1,
      locations: null,
      center: [36.114647, -115.172813]
    }
    this.setCenterBind = this.setCenter.bind(this)
  }

  componentDidMount() {
    const file = YAML.load(f)
    console.debug(file)
    this.setState({locations: file})
  }

  setCenter(lat, lng) {
    this.setState({center: [lat, lng]})
  }

  render() {
    return (
      <div className="gwcApp">
        <div className="detailPane">
          <LookupAddress 
            lookup_callback={this.setCenterBind}
          />
        </div>
        <OpportunityMap 
                        callbacks={this.callbacks}
                        center={this.state.center}
                        className="mapPane"
                        ref={(ref) => this.mapRef = ref}
                        locationId={this.state.locationId}
                        locations={this.state.locations}
                        {...this.props}
                    />   
      </div>
    )  
  }
}