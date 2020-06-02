import React, { Component } from "react";
import axios from 'axios';
import '../css/Medication.css';

export default class Medication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medications: [],
            currentPage: 1,
            // currentMedications: [],
            medicationsPerPage: 10,
            pageCount: 0,
            keys: [ 'Display', 'Code', 'Coding system', 'URL', 'Last updated'],
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        axios.get('http://hapi.fhir.org/baseR4?_getpages=f82ca097-09e0-4965-ba8c-94ca113b0ccf&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_bundletype=searchset')
            .then(data => {
                let response = data.data;
                let totalItemsCount = response.length;
                let pageCount = Math.ceil(totalItemsCount / 5)
                this.setState({
                    medications: response.entry,
                    pageCount
                });
            });
    }

    renderTableHeader() {
        let header = this.state.keys;
        return header.map((key, index) => {
            return <th key={index}>{key}</th>;
        });
    }

    renderTableData(tableData) {
        return tableData.map(medication => {
            const medicationResource = medication.resource;
            return (
                <tr key={medicationResource.id}>
                    {/* <td>{medicationResource.id}</td> */}
                    <td>{medicationResource.code.coding[0].display}</td>
                    <td>{medicationResource.code.coding[0].code}</td>
                    <td>{medicationResource.code.coding[0].system}</td>
                    <td>{medication.fullUrl}</td>
                    <td>{medicationResource.meta.lastUpdated}</td>
                </tr>
            );
        });
    }

    render() {
        const { medications, currentPage, medicationsPerPage } = this.state;
        const indexOfLastmedication = currentPage * medicationsPerPage;
        const indexOfFirstmedication = indexOfLastmedication - medicationsPerPage;
        const currentMedications = medications.slice(indexOfFirstmedication, indexOfLastmedication);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(medications.length / medicationsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <div
                    key={number}
                    id={number}
                    className="page"
                    onClick={this.handleClick}
                >
                    {number}
                </div>
            );
        });
        return (
            <div>
                <h1 id="title">MEDICATION PAGE</h1>
                <table id="tables">
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData(currentMedications)}
                    </tbody>
                </table>
                <div id="page-numbers">
                    {renderPageNumbers}
                </div>
            </div>
        );
    }
}
