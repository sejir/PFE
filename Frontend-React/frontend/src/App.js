// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import Homepage from './views/Homepage';
import Registerpage from './views/Registerpage';
import Loginpage from './views/Loginpage';
import Dashboard from './views/Dashboard';
import Navbar from './views/Navbar';
import Predict from './views/predict';
import ProfileUpdate from './views/ProfileUpdate';
import LayoutWithSidebar from './views/LayoutWithSidebar';
import ModelUpload from './views/ModelUpload';
import './App.css';


function App() {


    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                   <main role="main" className="main-content">
                        <div className="container-fluid">
                            <Switch>
                            <Route component={Loginpage} path="/login" />
                            <Route component={Registerpage} path="/register" exact />
                            <LayoutWithSidebar>
                                <PrivateRoute component={Dashboard} path="/dashboard" exact />
                                <PrivateRoute component={Predict} path="/predict" exact />
                                <PrivateRoute path="/profile/update" component={ProfileUpdate} />
                                <PrivateRoute component={Homepage} path="/" exact />
                                <PrivateRoute component={ModelUpload} path="/ModelUpload" exact />
                            </LayoutWithSidebar>
                            </Switch>
                        </div>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
