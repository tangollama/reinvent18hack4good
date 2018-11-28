import React, { Component } from 'react'
import './App.scss'
import OpportunityList from './components/OpportunityList'
import OpportunityMap from './components/OpportunityMap'
import YAML from 'yamljs'
import f from './testdata.yml'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      opportunity: null,
      opportunities: null,
      center: [36.114647, -115.172813]
    }
    this.callbacks = {
      setOpportunity: this.setOpportunity.bind(this),
      setCenter: this.setCenter.bind(this)
    }
  }

  componentDidMount() {
    const file = YAML.load(f)
    console.debug(file)
    this.setState({opportunities: file})
  }

  setCenter(lat, lng) {
    this.setState({center: [lat, lng]})
  }

  setOpportunity(opportunity) {
    if (!opportunity) {
      this.setState({opportunity: null})
    } else {
      this.setState({ opportunity: opportunity})    
    }
  }

  render() {
    if (this.state.opportunity) {
      const center = this.state.opportunity.location ? this.state.opportunity.location : [36.1699, -115.1398]
      return (
        <div>
          <h1>{this.state.opportunity.label}</h1>
          <div className="gwcApp">
            <div className="detailPane">
                <button onClick={() => { this.setOpportunity(null) }} className="closeButton">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style={{width: '24px', height: '24px', color: 'black'}}>
                        <path d="M13.06 12l5.72-5.72c.292-.292.292-.767 0-1.06-.294-.293-.768-.293-1.06 0L12 10.94 6.28 5.22c-.293-.293-.767-.293-1.06 0-.293.293-.293.768 0 1.06L10.94 12l-5.72 5.72c-.293.292-.293.767 0 1.06.146.146.338.22.53.22s.384-.074.53-.22L12 13.06l5.72 5.72c.145.146.337.22.53.22.19 0 .383-.074.53-.22.292-.293.292-.768 0-1.06L13.06 12z"></path>
                    </svg>
                </button>
            </div>
            <OpportunityMap
              className="mapPane"    
              center={center}          
              locations={this.state.opportunities} 
              callbacks={this.callbacks}
            />
          </div>          
        </div>
        
      )
    } else {
      return (
        <div>        
          <div className="gwcApp">
            <OpportunityList 
              opportunities={this.state.opportunities} 
              callbacks={this.callbacks}
            />
          </div>
        </div>
      )    
    }
  }
}