import React, { Component } from 'react';
import Patients from "./components/Patients";
import Medication from "./components/Medication";
import Button from 'react-bootstrap/Button';
import "./css/styles.css";
import Encounters from "./components/Encounters";
import Appointments from "./components/Appointments";
import CarePlan from "./components/CarePlan";
import AllergyIntolerances from "./components/AllergyIntolerances";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Link
} from "react-router-dom";
class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Link to="/patients">
                        <Button className="button" >
                            <span>Patients</span>
                        </Button>
                    </Link>
                    <Link to="/medication">
                        <Button className="button" >
                            <span>Medication</span>
                        </Button>
                    </Link>
                    <Route exact path="/patients" component={Patients}/>
                    <Redirect to="/patients" />
                    <Route exact path="/medication" component={Medication}/>
                    <Route exact path={`/patients/:patientId/encounters`} component={Encounters}/>
                    <Route exact path={`/patients/:patientId/carePlan`} component={CarePlan}/>
                    <Route exact path={`/patients/:patientId/appointments`} component={Appointments}/>
                    <Route exact path={`/patients/:patientId/allergies`} component={AllergyIntolerances}/>
                </Router>
            </div>
        );
    }
}

export default App;