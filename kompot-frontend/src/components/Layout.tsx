import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.scss';

const Layout: React.FC = () => {
  return(
    <>
      <Navbar />
      <div className="mainContainer">
        <Outlet/>
      </div>
    </>
    );
}


export default Layout;
