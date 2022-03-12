import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from 'SocketContext';
import { RoomData } from '@common/types';
import { SetGame } from 'games/Set/SetGame';
import { useNavigate } from 'react-router-dom';

const Room: React.FC = () => {
  let { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomData>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('getGameRoomRes', (res: RoomData|null) => {
      console.log(res);
      if(res === null){
        navigate('/');
        return;
      }
      setRoom(res);
      console.log(res);
    });

    socket.emit('join-room', roomId);
    return () => {
      socket.off('getGameRoomRes');
      socket.emit('leave-room');
    }
  }, [ roomId ]);

  const getGame = ( room: RoomData | undefined ) => {
    if(room === undefined) return <></>;

    switch(room.gameId){
      case 'set':
        return <SetGame roomId={room.id} gameState={room.gameState} />
    }
  }

  return(<>{getGame(room)}</>)
}

export default Room;
