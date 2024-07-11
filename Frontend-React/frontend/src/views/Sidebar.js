import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import sidebar styles
import logo from '../views/assets/logo.svg';

const Sidebar = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility
 
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <nav className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
            <div className="sidebar-header">
                <h3>Menu</h3>
                <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                    {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                </button>
            </div>
            <ul className="nav flex-column">
                <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <Link to="/dashboard" className="nav-link sidebar-link">
                        Tableau de bord
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/predict' ? 'active' : ''}`}>
                    <Link to="/predict" className="nav-link sidebar-link">
                        Prédire
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/profile/update' ? 'active' : ''}`}>
                    <Link to="/profile/update" className="nav-link sidebar-link">
                        Mettre à jour le profil
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/ModelUpload" className="nav-link sidebar-link">
                        Télécharger votre propre modèle
                    </Link>
                </li>
                {/* Add more sidebar links as needed */}
            </ul>
            <div className="sidebar-content">
                {/* Other sidebar content */}
                <img src={logo} alt="Logo" className="sidebar-logo" />
            </div>
        </nav>
    );
};

export default Sidebar;
