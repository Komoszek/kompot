import { SetGameState } from './Set/types';

export interface GameData {
  name: string;
  icon: string;
  id: string;
}

export interface RoomData extends RoomListItemData {
  players: {[key: string]: PlayerRoomData};
  gameState: SetGameState;
}

export interface PlayerRoomData {
  socketCount: number;
}

export interface RoomListItemData {
  id: string;
  name: string;
  playerCount: number;
  maxPlayerCount: number;
  gameId: string;
}

