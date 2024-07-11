import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import './ModelUpload.css'; // Import the CSS file

function ModelUpload() {
  const [res, setRes] = useState("");
  const [formData, setFormData] = useState({});
  const [htmlLink, setHtmlLink] = useState(''); 
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedModelType, setSelectedModelType] = useState("");  // Add state for selected model type
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [modelType, setModelType] = useState("");  // Add state for model type input
  const [listError, setListError] = useState("");
  const token = localStorage.getItem("authTokens");

  let userInfo = {};
  let isDataScientist = false; // Flag to check if user is a data scientist


  if (token) {
      const decode = jwtDecode(token);
      userInfo = {
          user_id: decode.user_id,
          username: decode.username,
          full_name: decode.full_name,
          image: decode.image,
          role: decode.role  // Assuming role is included in JWT payload
        };
      isDataScientist = userInfo.role === 'data_scientist';

  }

  const fetchModelList = async () => {
      try {
          const response = await axios.get("http://127.0.0.1:8000/predict/list-models/");
          setModels(response.data.models);
          setListError("");
      } catch (error) {
          console.error("Error fetching model list:", error);
          setListError("Error fetching model list");
      }
  };

  useEffect(() => {
      fetchModelList(); // Fetch the model list on component mount
  }, []);

  const handleChange = (e) => {
      // Determine if the value needs to be converted to a number based on the input type
      const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
  
      setFormData({
          ...formData,
          [e.target.name]: value
      });
  };

  const handleModelSelect = (e) => {
      const [modelName, modelType] = e.target.value.split('|');
      setSelectedModel(modelName);
      setSelectedModelType(modelType);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post("http://127.0.0.1:8000/predict/make-prediction/", {
              model_name: selectedModel,
              model_type: selectedModelType,
              data: formData
          });
          setRes(`Predicted value: ${response.data.predicted_value}, Estimation: ${response.data.Esitmation}`);
          setHtmlLink(`<a href="${response.data.Link}" target="_blank">Click here for more details</a>`);
                  } catch (error) {
          console.log(error);
          setRes("Error submitting form");
      }
  };

  const handleFileChange = (e) => {
      setFile(e.target.files[0]);
  };

  const handleModelTypeChange = (e) => {
      setModelType(e.target.value);
  };

  const handleFileUpload = async (e) => {
      e.preventDefault();
      const uploadFormData = new FormData();
      uploadFormData.append('model_file', file); // Use 'model_file' as the key
      uploadFormData.append('model_type', modelType);

      try {
          await axios.post("http://127.0.0.1:8000/predict/upload-model/", uploadFormData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          setUploadStatus("File uploaded successfully");
          fetchModelList(); // Fetch the model list after successful upload
      } catch (error) {
          console.error("Error uploading file:", error);
          setUploadStatus("Error uploading file");
      }
      const handleFileUpload = async (e) => {
        e.preventDefault();
        const uploadFormData = new FormData();
        uploadFormData.append('csv_file', file);
        try {
          await axios.post("http://127.0.0.1:8000/predict/handle-csv-upload/", uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setUploadStatus("File uploaded successfully");
          fetchModelList();
        } catch (error) {
          console.error("Error uploading file:", error);
          setUploadStatus("Error uploading file");
        }
      };
  };

    return (
        <div className="container">
            {userInfo.username && <Alert variant="info">Hello, {userInfo.role}!</Alert>}
            {isDataScientist && (
        <div>
          <h2>Upload a New Model</h2>
          <Form onSubmit={handleFileUpload}>
            <Form.Group controlId="fileUpload">
              <Form.Label>Upload Model:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} required />
            </Form.Group>
            <Form.Group controlId="modelType">
              <Form.Label>Model Type:</Form.Label>
              <Form.Control type="text" value={modelType} onChange={handleModelTypeChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
          {uploadStatus && <Alert variant="info" className="mt-3"><strong>{uploadStatus}</strong></Alert>}
        </div>
      )}
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="fileUpload">
              <Form.Label>Upload CSV File:</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleFileChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
            </Form>
            {uploadStatus && <Alert variant="info" className="mt-3"><strong>{uploadStatus}</strong></Alert>}

      <br></br>
            <h2>Data Model Form</h2>
            
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="modelSelect">
                    <Form.Label>Select Model:</Form.Label>
                    <Form.Control as="select" onChange={handleModelSelect} required>
                        <option value="">Select a model</option>
                        {models.map((model, index) => (
                            <option key={index} value={`${model.model}|${model.model_type}`}>{model.model} ({model.model_type})</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <div className="scrollable">
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
                </div>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            {res && (
  <Alert variant="info">
    {res}
    {htmlLink && (
      <span dangerouslySetInnerHTML={{ __html: htmlLink }} />
    )}
  </Alert>
)}

           
        </div>
    );
}

export default ModelUpload;
