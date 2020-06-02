import React, { Component } from 'react';
import axios from 'axios';

export default class AllergyIntolerances extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intolerances: [],
            keys: ['Clinical status', 'Verification status', 'Category', 'Criticality', "Manifestation", "Severity"]
        };

    }
    renderTableHeader() {
        let header = this.state.keys;
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    }
    renderTableData(tableData) {
        return tableData.map(intolerance => {
            return (
                <tr key={intolerance.resource.id}>
                    <td>{intolerance.resource.clinicalStatus && intolerance.resource.clinicalStatus.coding && intolerance.resource.clinicalStatus.coding[0].code }</td>
                    <td>{intolerance.resource.verificationStatus && intolerance.resource.verificationStatus.coding && intolerance.resource.verificationStatus.coding[0].code }</td>
                    <td>{intolerance.resource.category.join(", ")}</td>
                    <td>{intolerance.resource.criticality}</td>
                    <td>{intolerance.resource.reaction && intolerance.resource.reaction[0] && intolerance.resource.reaction[0].manifestation[0].text }</td>
                    <td>{intolerance.resource.reaction && intolerance.resource.reaction[0] && intolerance.resource.reaction[0].severity }</td>
                </tr>
            );
        });
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(`http://hapi.fhir.org/baseR4/AllergyIntolerance?patient=${params.patientId}&_format=json&_pretty=true`)
        .then(data => {
                let response = data.data;
                if(response.total === 0){
                    return;
                }
                this.setState({
                    intolerances: response.entry
                });
            });
    }
    render() {
        return (
            <div>
                <h1 id="title">Allergy Intolerances</h1>
                <table id="tables">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData(this.state.intolerances || [])}
                    </tbody>
                </table>
            </div>
        )
    }
}