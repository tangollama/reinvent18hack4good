import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import { generateIcon } from '../../utils'

export default class OpportunityMap extends Component {

  static propTypes = {
      callbacks: PropTypes.object.isRequired,
      className: PropTypes.string,
      center: PropTypes.array.isRequired,
      locationId: PropTypes.number.isRequired,
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

    this.addMarkers(true)
    this.map.on('moveend', () => {      
      this.addMarkers()
    })    
  }

  componentWillUnmount() {
    this.map.off('moveend')
  }

  componentWillReceiveProps(nextProps) {
    this.map.setView(nextProps.center, this.map.getZoom())
  }

  _generatePopup(location) {

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
  addMarkers(hardRefresh = false) {
    const { center, locationId } = this.props
    const map = this.map
    const bounds = map.getBounds()
    let added = 0
    this.props.locations.forEach(location => {
      if (location.lat && location.lng && bounds.contains(L.latLng(location.lat, location.lng))) {        
        if (!location.marker) {
          added++
        } /*else {
          skipPainting++
        }*/
        if (!location.marker) {
          location.marker = L.marker([location.lat, location.lng], 
            {
              icon: generateIcon(location),
              title: location.name,
              alt: location.name
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
      } 
    })
  }

  render() {
    return (
      <div className={this.props.className} ref={(ref) => this.mapRef = ref}></div>
    )
  }
}