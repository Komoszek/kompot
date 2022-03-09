import React from 'react';
import './RoomListItem.scss';
import { RoomListItemData } from '@common/types';
import { Link } from 'react-router-dom';

interface RoomListItemProps {
  room: RoomListItemData;
}

const RoomListItem: React.FC<RoomListItemProps> = ( props ) => {
  const room = props.room;
  return(
    <Link className="roomListItem card" to={`/room/${room.id}`}>
        <div className="roomContent">
          <h2 className="roomName">{room.name}</h2>
        </div>
    </Link>
  );
}

export default RoomListItem;
