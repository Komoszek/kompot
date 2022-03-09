import React from 'react';
import './App.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import Home from 'pages/Home/Home';
import Lobby from 'pages/Lobby/Lobby';
import Room from 'pages/Room/Room';
import {SocketContext, socket} from 'SocketContext';

const App: React.FC = () => {

  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="lobby/*" element={<Lobby/>} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="room/:roomId" element={<Room/>} />
        </Route>
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
