import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar: React.FC = () =>   {
  return (
    <nav className="navbar">
      <Link to="" >Home</Link>
      <Link to="/lobby" >Lobby</Link>
      <Link to="/new-room" className="last-item">Add new room</Link>
    </nav>
  );
}


export default Navbar;
