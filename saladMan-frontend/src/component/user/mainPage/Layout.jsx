import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container layout-scroll-wrapper">
      {children}
    </div>
  );
};

export default Layout;
