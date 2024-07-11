import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';  // Ensure this import is correctly spelled
import './predict.css'; // Import the CSS file

function Predict() {
    const [res, setRes] = useState("");
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem("authTokens");

    let userInfo = {};

    if (token) {
        const decode = jwtDecode(token);
        userInfo = {
            user_id: decode.user_id,
            username: decode.username,
            full_name: decode.full_name,
            image: decode.image
        };
    }

    const handleChange = (e) => {
        // Determine if the value needs to be converted to a number based on the input type
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/predict/form/", formData);
            setRes(`Predicted value: ${response.data.predicted_value}`);
        } catch (error) {
            console.log(error);
            setRes("Error submitting form");
        }
    };

    return (
        <div className="container">
            <h1>Data Model Form</h1>
            {userInfo.username && <Alert variant="info">Hello, {userInfo.username}!</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="GROUPE_OFFRE">
                    <Form.Label>GROUPE_OFFRE:</Form.Label>
                    <Form.Control type="number" name="GROUPE_OFFRE" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="HANDSET">
                    <Form.Label>HANDSET:</Form.Label>
                    <Form.Control type="number" name="HANDSET" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W0">
                    <Form.Label>MNT_FORF_DATA_W0:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W0" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_TRANSFERT_IN_M4">
                    <Form.Label>MNT_TRANSFERT_IN_M4:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_TRANSFERT_IN_M4" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_TRANSFERT_OUT_M4">
                    <Form.Label>MNT_TRANSFERT_OUT_M4:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_TRANSFERT_OUT_M4" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_RECHARGE_SUP5_W6">
                    <Form.Label>MNT_RECHARGE_SUP5_W6:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_RECHARGE_SUP5_W6" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W1">
                    <Form.Label>MNT_FORF_DATA_W1:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W1" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W2">
                    <Form.Label>MNT_FORF_DATA_W2:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W2" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W3">
                    <Form.Label>MNT_FORF_DATA_W3:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W3" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W4">
                    <Form.Label>MNT_FORF_DATA_W4:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W4" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W5">
                    <Form.Label>MNT_FORF_DATA_W5:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W5" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W6">
                    <Form.Label>MNT_FORF_DATA_W6:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W6" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W7">
                    <Form.Label>MNT_FORF_DATA_W7:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W7" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W8">
                    <Form.Label>MNT_FORF_DATA_W8:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W8" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT_FORF_DATA_W9">
                    <Form.Label>MNT_FORF_DATA_W9:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT_FORF_DATA_W9" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="NB_FORF_DATA_W9">
                    <Form.Label>NB_FORF_DATA_W9:</Form.Label>
                    <Form.Control type="number" name="NB_FORF_DATA_W9" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="USG_REVENUE_AMT_SMS_W9">
                    <Form.Label>USG_REVENUE_AMT_SMS_W9:</Form.Label>
                    <Form.Control type="number" step="0.01" name="USG_REVENUE_AMT_SMS_W9" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="NB_APPEL_M4_y">
                    <Form.Label>NB_APPEL_M4_y:</Form.Label>
                    <Form.Control type="number" name="NB_APPEL_M4_y" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="USG">
                    <Form.Label>USG:</Form.Label>
                    <Form.Control type="number" step="0.01" name="USG" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="REVENU">
                    <Form.Label>REVENU:</Form.Label>
                    <Form.Control type="number" step="0.01" name="REVENU" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="MNT">
                    <Form.Label>MNT:</Form.Label>
                    <Form.Control type="number" step="0.01" name="MNT" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="GROUPE">
                    <Form.Label>GROUPE:</Form.Label>
                    <Form.Control type="number" step="0.01" name="GROUPE" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="NB">
                    <Form.Label>NB:</Form.Label>
                    <Form.Control type="number" step="0.01" name="NB" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="VOLUME">
                    <Form.Label>VOLUME:</Form.Label>
                    <Form.Control type="number" step="0.01" name="VOLUME" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="DURATION">
                    <Form.Label>DURATION:</Form.Label>
                    <Form.Control type="number" step="0.01" name="DURATION" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="NUM">
                    <Form.Label>NUM:</Form.Label>
                    <Form.Control type="number" step="0.01" name="NUM" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="DUREE">
                    <Form.Label>DUREE:</Form.Label>
                    <Form.Control type="number" step="0.01" name="DUREE" onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            {res && <Alert variant="success" className="mt-3"><strong>{res}</strong></Alert>}
        </div>
    );
}

export default Predict;
