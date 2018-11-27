import React from 'react'
import L from 'leaflet'
import { renderToString } from 'react-dom/server'
//https://react-icons.netlify.com
import { FaCode } from 'react-icons/fa'

export const generateIcon = (store) => {
    const color = '#6eceb2'
    //console.log(`icon size of ${iconSize} with scaler ${scaling}`)
    //return L.AwesomeMarkers.icon({ markerColor: statusColor(store), prefix: 'fa', icon: 'coffee', iconSize: iconSize})
    return L.divIcon({
        className: "opportunityPin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: renderToString(<span className="markerWrapper" style={{backgroundColor: color}}><FaCode /></span>)
    })
}

export const removeLineBreaks = (text) => {
    return text.replace(/(\r\n\t|\n|\r\t)/gm," ")
}

export const randomPoint = (map) => {
    const bounds = map.getBounds()
    const x_min  = bounds.getEast()
    const x_max  = bounds.getWest()
    const y_min  = bounds.getSouth()
    const y_max  = bounds.getNorth()

    const lat = y_min + (Math.random() * (y_max - y_min))
    const lng = x_min + (Math.random() * (x_max - x_min))

    const pt = L.latLng(lat, lng)

    if (bounds.contains(pt)) {
        return [lat, lng]
    } else {
        return randomPoint(map)
    }
}