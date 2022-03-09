import databaseJSON from './database.json';
import { RoomData } from '@common/types';
import { IDatabase } from './types';

const DATABASE: IDatabase = databaseJSON;

export const GetRoomByRoomId = ( id: string): RoomData|null => {
  if(!DATABASE.rooms.hasOwnProperty(id))
    return null;

  return DATABASE.rooms[id];
}

export const GetAllRooms = (): RoomData[] => {
  return Object.values(DATABASE.rooms);
}

export const GetRoomsByGameId = ( id: string ): RoomData[] => {
  return Object.values(DATABASE.rooms).filter((room: RoomData) => room.gameId === id);
}
