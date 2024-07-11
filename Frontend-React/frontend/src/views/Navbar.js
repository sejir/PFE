import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../views/assets/logo.svg';
import profiledefault from '../views/assets/default.jpg';
import './Navbar.css';

function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);

    return (
<nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0056b3' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={logo} height="40" alt="Logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                        
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            src={user.image ? `http://127.0.0.1:8000${user.image}` : profiledefault}
                                            alt="Profile"
                                            className="rounded-circle"
                                            width="40"
                                            height="40"
                                        />
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item" to="/profile/update">Profile</Link></li>
                                        <li><a className="dropdown-item" onClick={logoutUser} style={{ cursor: 'pointer' }}>Logout</a></li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
