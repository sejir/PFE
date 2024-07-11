import React, { useState, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Table,Alert } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [res, setRes] = useState("");
  const [distributionData, setDistributionData] = useState({});
  const [distribution2Data, setDistribution2Data] = useState([]);
  const [handsetDistributionData, setHandsetDistributionData] = useState([]);
  const [offerGroupDistributionData, setOfferGroupDistributionData] = useState([]);
  const [pastPredictions, setPastPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const authentication = useAxios();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authentication.get("/test/");
        setRes(response.data.response);
      } catch (error) {
        console.log(error);
        setRes("Something went wrong");
      }
    };
    fetchData();
  }, [authentication]);

  useEffect(() => {
    const fetchDistributionData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/predict/distribution/');
        setDistributionData(response.data.distribution);
      } catch (error) {
        console.error('Error fetching distribution data:', error);
      }
    };

    const fetchDistribution2Data = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/predict/distribution2/');
        setDistribution2Data(response.data);
      } catch (error) {
        console.error('Error fetching distribution2 data:', error);
      }
    };

    const fetchHandsetDistributionData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/predict/handset_distribution/');
        setHandsetDistributionData(response.data);
      } catch (error) {
        console.error('Error fetching handset distribution data:', error);
      }
    };

    const fetchOfferGroupDistributionData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/predict/offer_group_distribution/');
        setOfferGroupDistributionData(response.data);
      } catch (error) {
        console.error('Error fetching offer group distribution data:', error);
      }
    };

    const fetchPastPredictions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/predict/past_predictions/');
        setPastPredictions(response.data.predictions); // Make sure to set 'predictions' key from response
      } catch (error) {
        console.error('Error fetching past predictions:', error);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDistributionData(),
        fetchDistribution2Data(),
        fetchHandsetDistributionData(),
        fetchOfferGroupDistributionData(),
        fetchPastPredictions()
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const renderDistributionChart = () => {
    const categories = Object.keys(distributionData);
    const dataValues = Object.values(distributionData);

    const data = {
      labels: categories,
      datasets: [
        {
          label: 'Prediction Distribution',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
          data: dataValues,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Prediction Distribution',
          font: {
            weight: 'bold',
            size: 16,
          },
        },
      },
    };

    return (
      <div className="dashboard-chart-container" style={{ height: '400px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };

  const renderDistribution2Chart = () => {
    const labels = distribution2Data.map(item => item.prediction.toFixed(2));
    const data = distribution2Data.map(item => item.count);

    const chartData = {
      labels,
      datasets: [{
        label: 'Prediction Distribution from distribution2',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
        data,
      }],
    };

    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Prediction Distribution from distribution2',
          font: {
            weight: 'bold',
            size: 16,
          },
        },
        legend: {
          position: 'bottom', // Adjust legend position as needed
        },
      },
    };

    return (
      <div className="dashboard-chart-container" style={{ height: '400px' }}>
        <Pie data={chartData} options={options} />
      </div>
    );
  };

  const renderHandsetDistributionChart = () => {
    const labels = handsetDistributionData.map(item => item.handset);
    const data = handsetDistributionData.map(item => item.count);

    const chartData = {
      labels,
      datasets: [{
        label: 'Handset Distribution',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data,
      }],
    };

    return <Line data={chartData} />;
  };

  const renderOfferGroupDistributionChart = () => {
    const labels = offerGroupDistributionData.map(item => item.offer_group);
    const data = offerGroupDistributionData.map(item => item.count);

    const chartData = {
      labels,
      datasets: [{
        label: 'Offer Group Distribution',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data,
      }],
    };

    return <Bar data={chartData} />;
  };

  const renderPastPredictionsTable = () => {
    return (
      <div className="dashboard-table">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Handset</th>
              <th>Offer Group</th>
              <th>Prediction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pastPredictions.map((prediction, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{prediction.handset}</td>
                <td>{prediction.offer_group}</td>
                <td>{prediction.prediction.toFixed(2)}</td>
                <td>{new Date(prediction.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="container-fluid">
        <div className="row">
          
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2 dashboard-heading">My Dashboard</h1>
              {userInfo.username && <Alert variant="info">Hello, {userInfo.username}!</Alert>}
              </div>
            {/* Removed the alert div */}
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="dashboard-section">
                    {renderDistributionChart()}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-section">
                    {renderDistribution2Chart()}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="dashboard-section">
                    <h3 className="dashboard-heading">Handset Distribution</h3>
                    {handsetDistributionData.length > 0 ? renderHandsetDistributionChart() : <p>No data available</p>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-section">
                    <h3 className="dashboard-heading">Offer Group Distribution</h3>
                    {offerGroupDistributionData.length > 0 ? renderOfferGroupDistributionChart() : <p>No data available</p>}
                  </div>
                </div>
              </div>
              {pastPredictions.length > 0 && (
                <div className="dashboard-section">
                  <h3 className="dashboard-heading">Past Predictions</h3>
                  {renderPastPredictionsTable()}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
