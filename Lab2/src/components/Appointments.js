import React, { Component } from 'react';
import axios from 'axios';

export default class Appointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            keys: ['Status', 'Description', 'Start', 'End', "Duration", "Actors"]
        };

    }
    renderTableHeader() {
        let header = this.state.keys;
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    }
    renderTableData(tableData) {
        return tableData.map(appointment => {
            return (
                <tr key={appointment.resource.id}>
                    <td>{appointment.resource.status}</td>
                    <td>{appointment.resource.description}</td>
                    <td>{appointment.resource.start}</td>
                    <td>{appointment.resource.end}</td>
                    <td>{appointment.resource.minutesDuration}</td>
                    <td>{appointment.resource.participant.map(actor => { return <p>{actor.actor.reference || actor.actor.display || "-"}</p> })}</td>
                </tr>
            );
        });
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(`http://hapi.fhir.org/baseR4/Appointment?actor=Patient/${params.patientId}&_format=json&_pretty=true`)
        .then(data => {
                let response = data.data;
                if(response.total === 0){
                    return;
                }
                this.setState({
                    appointments: response.entry
                });
            });
    }
    render() {
        return (
            <div>
                <h1 id="title">Appointments</h1>
                <table id="tables">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData(this.state.appointments || [])}
                    </tbody>
                </table>
            </div>
        )
    }
}