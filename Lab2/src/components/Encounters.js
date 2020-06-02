import React, { Component } from 'react';
import axios from 'axios';

export default class Encounters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            encounters: [],
            keys: ['Subject', 'Encounter period', 'Location', 'Status', "Period"]
        };

    }
    renderTableHeader() {
        let header = this.state.keys;
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    }
    renderTableData(tableData) {
        return tableData.map(encounter => {
            const subject = encounter.resource.subject && encounter.resource.subject.reference;
            const period = encounter.resource.period && (encounter.resource.period.start || "/") + "-" + (encounter.resource.period.end || "/");
            const location = encounter.resource.location || [];
            const statusArray = location.map(loc => { return <p>{loc.status  || "-"}</p> });
            const status = statusArray.length === 0 ? encounter.resource.status : statusArray;
            return (
                <tr key={encounter.resource.id}>
                    <td> {subject}</td>
                    <td> {period}</td>
                    <td>{location.map(loc => { return <p>{loc.location.display || "-"}</p> })}</td>
                    <td>{status}</td>
                    <td>
                        {location.map(loc => { return <p>{((loc.period && loc.period.start) || "/") + "-" + ((loc.period && loc.period.end)|| "/")}</p> })}
                    </td>
                </tr>
            );
        });
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(`http://hapi.fhir.org/baseR4/Encounter?subject=${params.patientId}&_format=json&_pretty=true`)
            .then(data => {
                let response = data.data;
                if(response.total === 0){
                    return;
                }
                this.setState({
                    encounters: response.entry
                });
            });
    }
    render() {
        return (
            <div>
                <h1 id="title">Encounters</h1>
                <table id="tables">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData(this.state.encounters)}
                    </tbody>
                </table>
            </div>
        )
    }
}