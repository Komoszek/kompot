import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import RoomList from './RoomList';
import { RoomData } from '@common/types';
import './GameLobby.scss';
import { SocketContext } from 'SocketContext';


const GameLobby: React.FC = () => {
  const { gameId } = useParams();
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on('getRoomsRes', (res: RoomData[]) => {
      setRooms(res);
    });

    socket.emit('getRooms', gameId);
    return () => {
      socket.off('getRoomsRes');
    }
  }, [ gameId ]);

  return(
    <div className="gameLobby">
      <RoomList list={rooms}/>
    </div>
  );
}

export default GameLobby;
