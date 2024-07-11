
import pic1 from '../views/assets/photo-4.jpg';
import pic2 from '../views/assets/gaming-3.jfif';
import pic3 from '../views/assets/tt-au-big-tech.jpg';
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './Homepage.css'; // Adjust the path according to your project structure

function Homepage() {
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
  return (

    <div>
      <main role="main" style={{ marginTop: 50 }}>
      {userInfo.username && <Alert variant="info">Hello, {userInfo.username}!</Alert>}
        {/* Main jumbotron for a primary marketing message or call to action */}
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-1 text-center" >Tunisie Telecom </h1>
            <h2 className="display-5 text-center">La vie est émotions </h2>
            <p>
             
            </p>
            <p>
              <a className="btn btn-primary btn-lg" href="#" role="button">
                Lire la suite »
              </a>
            </p>
          </div>
        </div>
        <div className="container">
          {/* Example row of columns */}
          <div className="row justify-content-center text-main">
            <div className="borders col-sm-5 col-lg-4 my-2">
              <div className="card border-secondary no-shadow radius-30 border-1 h-100">
                <img
                  className="card-img-top border-0"
                  src={pic1}
                  alt="Tunisie Telecom reçoit le major de promotion du bac 2024, fils de l’une de ses employées"
                />
                <div className="card-body">
                  <h5 className="card-title medium line-clamp-2 font-22">
                    Tunisie Telecom reçoit le major de promotion du bac 2024, fils de l’une de ses employées
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="mb-0 lightItalic font-12 align-self-end">
                      Publié le : 04/07/2024
                    </p>
                    <a
                      href="/particulier/actualite/lemajordepromotiondubac2024/"
                      title="Tunisie Telecom reçoit le major de promotion du bac 2024, fils de l’une de ses employées"
                      className="btn particulier text-white px-3 radius-30 regular border-0"
                    >
                      Lire la suite
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="borders col-sm-5 col-lg-4 my-2">
              <div className="card border-secondary no-shadow radius-30 border-1 h-100">
                <img
                  className="card-img-top border-0"
                  src={pic2}
                  alt="La finale du tournoi Gaming ‘‘E-sports Playground by TT’’ a été un franc succès"
                />
                <div className="card-body">
                  <h5 className="card-title medium line-clamp-2 font-22">
                    La finale du tournoi Gaming ‘‘E-sports Playground by TT’’ a été un franc succès
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="mb-0 lightItalic font-12 align-self-end">
                      Publié le : 28/06/2024
                    </p>
                    <a
                      href="/particulier/actualite/e-sports-playground-by-tt/"
                      title="La finale du tournoi Gaming ‘‘E-sports Playground by TT’’ a été un franc succès"
                      className="btn particulier text-white px-3 radius-30 regular border-0"
                    >
                      Lire la suite
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="borders col-sm-5 col-lg-4 my-2">
              <div className="card border-secondary no-shadow radius-30 border-1 h-100">
                <img
                  className="card-img-top border-0"
                  src={pic3}
                  alt="Le groupe Tunisie Telecom sponsor gold du BIGTECH"
                />
                <div className="card-body">
                  <h5 className="card-title medium line-clamp-2 font-22">
                    Le groupe Tunisie Telecom sponsor gold du BIGTECH
                  </h5>
                  <div className="d-flex justify-content-between">
                    <p className="mb-0 lightItalic font-12 align-self-end">
                      Publié le : 27/06/2024
                    </p>
                    <a
                      href="/particulier/actualite/bigtech/"
                      title="Le groupe Tunisie Telecom sponsor gold du BIGTECH"
                      className="btn particulier text-white px-3 radius-30 regular border-0"
                    >
                      Lire la suite
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
        {/* /container */}
      </main>
      <footer className="container">
        <p>© Company 2017-2018</p>
      </footer>
    </div>
  );
}

export default Homepage;
