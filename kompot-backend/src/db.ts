import databaseJSON from './database.json';
import { RoomData, PlayerRoomData } from '@common/types';
import { IDatabase, SessionData, UserData } from './types';
import { randomId } from 'api/api';

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

export const GetSessionDataById = ( id: string ): SessionData|null => {
  if(!DATABASE.sessions.hasOwnProperty(id))
    return null;
  
  return DATABASE.sessions[id];
}

export const RemoveSessionDataById = ( id: string) => {
  delete DATABASE.sessions[id];
}

export const GetUserById = ( id: string): UserData|null => {
  if(!DATABASE.users.hasOwnProperty(id))
    return null;

  return DATABASE.users[id];
}

export const IncrementSocketCountForPlayer = (roomId: string, userId: string) => {
  const room = GetRoomByRoomId(roomId);

  if(room === null) return;
  if(!room.players.hasOwnProperty(userId)){
    room.players[userId] = {
      socketCount: 0,
    };
    room.playerCount++;
  } 
  
  room.players[userId].socketCount++;
}

export const DecrementSocketCountForPlayer = (roomId: string, userId: string) => {
  const room = GetRoomByRoomId(roomId);
  console.log(room, userId);
  if(room === null) return;
  if(!room.players.hasOwnProperty(userId)) return;
  if(room.players[userId].socketCount == 1){
    delete room.players[userId];
    room.playerCount--;
    return;
  }

  room.players[userId].socketCount--;
}

export const AddNewSession = (userId: string, expirationDate: Date): string => {
  let sessionId = '';

  do {
    sessionId = randomId(16);
  } while(GetSessionDataById(sessionId) != null);

  DATABASE.sessions[sessionId] = {
    id: sessionId,
    userId: userId,
    expirationDate: expirationDate,
  };

  return sessionId;
}

export const AddNewGuestUser = (): string => {
  let userId = '';

  do {
    userId = randomId(16);
  } while(GetUserById(userId) != null);

  const username = `User #${userId}`;

  DATABASE.users[userId] = {
    id: userId,
    name: username,
  };

  return userId;
}

export const AddNewSetRoom = () => {
  let roomId = '';

  do {
    roomId = randomId(12);
  } while(GetRoomByRoomId(roomId) !== null);
  console.log(roomId);
  DATABASE.rooms[roomId] = {
    id: roomId,
    name: roomId,
    gameId: 'set',
    playerCount: 0,

    players: {},
    gameState: {
      scoreBoard: {},
      gameOn: false, 
      remainingCards: [],
      boardState: [],
    },
    maxPlayerCount: 10,

  }
}