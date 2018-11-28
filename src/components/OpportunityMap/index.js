import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import { generateIcon, randomPoint } from '../../utils'
import { renderToString } from 'react-dom/server'

export default class OpportunityMap extends Component {

  static propTypes = {
      callbacks: PropTypes.object.isRequired,
      className: PropTypes.string,
      center: PropTypes.array.isRequired,
      locations: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      zoom: 12
    }
    this.map = null
    this.markerClick = this._markerClick.bind(this)
  }

  componentDidMount() {
    const {center } = this.props
    let zoom = this.state.zoom
    
    this.map = L.map(this.mapRef).setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    this.addMarkers()
    this.map.on('moveend', () => {      
      this.addMarkers()
    })    
  }

  componentWillUnmount() {
    this.map.off('moveend')
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.locations && !this.props.locations) {
      this.addMarkers()
    }
    this.map.setView(nextProps.center, this.map.getZoom())
  }

  _generatePopup(location) {
    return renderToString(<div>
      <h3>{location.label}</h3>
    </div>)
  }

  _updateMarkerIcons(list) {
    list.forEach(location => {
      location.marker.setIcon(generateIcon(location))
    })
  }

  _markerClick(event, location) {
    event.target.unbindPopup()
    event.target.bindPopup(this._generatePopup(location)).openPopup()
  }

  /**
   * Smartly add Markers to the Map based on the bounded window, paying attention to what we've already added
   */
  addMarkers() {
    const { center, locationId } = this.props
    const map = this.map    
    this.props.locations.forEach(location => {
      if (!location.lat || !location.lng) {
        const pt = randomPoint(map)
        location.lat = pt[0]
        location.lng = pt[1]
      }
      if (!location.marker) {
        location.marker = L.marker([location.lat, location.lng], 
          {
            icon: generateIcon(location),
            title: location.label,
            alt: location.label
          }
        )
        location.marker.addTo(map)
        location.marker.on('click', (event) => { this._markerClick(event, location)})
      } else {
        if (location.status) {
          location.marker.setIcon(generateIcon(location))
        }
        map.removeLayer(location.marker)
        location.marker.addTo(map)
        location.marker.on('click', (event) => { this._markerClick(event, location)})
        if (center[0] == location.lat && center[1] == location.lng) {
          if (locationId == location.id) {
            location.marker.unbindPopup()
            location.marker.bindPopup(this._generatePopup(location)).openPopup()  
          } 
        }
      }
    })
  }

  render() {
    return (
      <div className={this.props.className} ref={(ref) => this.mapRef = ref}></div>
    )
  }
}