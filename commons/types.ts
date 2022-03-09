import { SetGameState } from './Set/types';

export interface GameData {
  name: string;
  icon: string;
  id: string;
}

export interface RoomData extends RoomListItemData {
  players: string[];
  gameState: SetGameState;
}

export interface RoomListItemData {
  id: string;
  name: string;
  playerCount: number;
  maxPlayerCount: number;
  gameId: string;
}
// add interface for room in roomlist (or not)
