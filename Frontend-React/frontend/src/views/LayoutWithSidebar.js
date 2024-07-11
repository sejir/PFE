import React from 'react';
import Sidebar from './Sidebar';

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
