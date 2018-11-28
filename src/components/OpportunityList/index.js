import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class OpportunityList extends Component {

    static propTypes = {
        opportunities: PropTypes.array,
        callbacks: PropTypes.object.isRequired
    }
  
    constructor(props) {
      super(props)
    }

    render() {
        if (this.props.opportunities) {
            return (
            <table className="opportunitiesList">
                <thead>
                    <tr>
                        <th>Opportunity</th>
                        <th>Time</th>
                        <th>Steps</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.opportunities.map((opportunity, i) => (
                    <tr key={`opportunity-${i}`} onClick={() => { 
                        this.props.callbacks.setOpportunity(opportunity)
                    }}>
                        <td>{opportunity.label}</td>
                        <td><span>{opportunity.time_commitment}</span></td>
                        <td>
                            <ul>
                            {
                                opportunity.steps.map((step, i) => (
                                    <li key={`opportunity-${i}_step-${i}`}><span>{step.label}</span> {step.description}</li>
                                ))
                            }
                            </ul>
                        </td>

                    </tr>              
                    ))
                }
                </tbody>
            </table>)
        } else {
            return <div>No data available.</div>
        }
    }
}  