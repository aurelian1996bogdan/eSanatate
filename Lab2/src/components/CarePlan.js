import React, { Component } from 'react';
import axios from 'axios';

export default class CarePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carePlan: [],
            keys: ['Subject', 'Encounter', 'Status', 'Category', "Description"]
        };

    }
    renderTableHeader() {
        let header = this.state.keys;
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    }
    renderTableData(tableData) {
        return tableData.map(carePlan => {
            return (
                <tr key={carePlan.resource.id}>
                    <td> {carePlan.resource.subject.reference}</td>
                    <td> {carePlan.resource.encounter && carePlan.resource.encounter.reference}</td>
                    <td>{carePlan.resource.status}</td>
                    <td>{carePlan.resource.category && carePlan.resource.category[0] && carePlan.resource.category[0].coding[0] && carePlan.resource.category[0].coding[0].display}</td>
                    <td>{carePlan.resource.description}</td>
                </tr>
            );
        });
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(`http://hapi.fhir.org/baseR4/CarePlan?subject=${params.patientId}&_format=json&_pretty=true`)
        .then(data => {
                let response = data.data;
                if(response.total === 0){
                    return;
                }
                this.setState({
                    carePlan: response.entry
                });
            });
    }
    render() {
        return (
            <div>
                <h1 id="title">CarePlan</h1>
                <table id="tables">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData(this.state.carePlan || [])}
                    </tbody>
                </table>
            </div>
        )
    }
}