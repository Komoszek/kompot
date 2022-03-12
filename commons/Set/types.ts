export interface Card {
  color: number;
  fill: number;
  count: number;
  shape: number;
  isTaken: boolean;
}

export interface SetGameState {
  gameOn: boolean;
  remainingCards: Card[];
  boardState: Card[];
  scoreBoard: { [key: string]: number};
}