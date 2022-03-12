import { RoomData } from '@common/types';

export interface SessionData {
  id: string;
  userId: string;
  expirationDate: Date;
}

export interface UserData {
  id: string;
  name: string;
}

export interface IDatabase {
  rooms: { [key: string]: RoomData};
  sessions: {[key: string]: SessionData};
  users: {[key: string]: UserData}
}

export interface SocketData {
  userId: string|undefined;
  joinedRooms: string[];
}
