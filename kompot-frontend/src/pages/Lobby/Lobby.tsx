import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import GameLobby from './GameLobby';
import ChooseLobby from './ChooseLobby';

const Lobby: React.FC = () => {
  return(
    <Routes>
        <Route index element={<ChooseLobby />}/>
        <Route path=":gameId" element={<GameLobby />}/ >
        <Route path="*" element={<Navigate to="/lobby" />} />
    </Routes>);
}

export default Lobby;
