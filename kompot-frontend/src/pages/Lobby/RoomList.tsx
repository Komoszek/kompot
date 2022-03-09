import React from 'react';
import './RoomList.scss';
import RoomListItem from './RoomListItem';
import { RoomListItemData } from '@common/types';

interface RoomListProps {
  list: RoomListItemData[];
}

const RoomList: React.FC<RoomListProps> = ( props ) => {
  const list = props.list;

  return(
    <div className="roomList">
      {list.map(item =>
        <RoomListItem key={item.id} room={item}/>
      )}
    </div>
  );
}

export default RoomList;
