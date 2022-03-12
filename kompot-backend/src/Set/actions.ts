import { SetGameState, Card } from '@common/Set/types'
import { isSortedNumArrUniq, shuffle } from '@common/helpers'

const AllCardsTaken = ( set: Card[] ): boolean => {
  for(let i = 0; i < set.length; i++){
    if(set[i].isTaken === false){
      return false;
    }
  }

  return true;
}

const CheckSet = ( cardSet: Card[] ): boolean => {
  const N = 3;
  if( cardSet.length != N){
    return false;
  }

  if(AllCardsTaken(cardSet)) return false;

  let color = 0, fill = 0, count = 0, shape = 0;

  for(let i = 0; i < N; i++){
    color += cardSet[i].color;
    fill += cardSet[i].fill;
    count += cardSet[i].count;
    shape += cardSet[i].shape;
  }

  color %= N;
  if(color !== 0) return false;

  fill %= N;
  if(fill !== 0) return false;

  count %= N;
  if(count !== 0) return false;

  shape %= N;
  if(shape !== 0) return false;

  return true;
}

const GetMatchingFeature = (x: number, y: number): number => {
  return (6 - x - y) % 3;
}

const CalculateMatchingCard = (c1: Card, c2: Card): Card => {
  return {
    color: GetMatchingFeature(c1.color, c2.color),
    fill: GetMatchingFeature(c1.fill, c2.fill),
    count: GetMatchingFeature(c1.count, c2.count),
    shape: GetMatchingFeature(c1.shape, c2.shape),
    isTaken: false
  }
}


const AreCardsEqual = (c1: Card, c2: Card): boolean => {
  if(c1.color != c2.color) return false;
  if(c1.fill != c2.fill)   return false;
  if(c1.count != c2.count) return false;
  if(c1.shape != c2.shape) return false;
  return true
}

const IsSetAvailable = (boardState: Card[]): boolean => {
  const N = boardState.length;
  for(let i = 0; i < N; i++){
    for(let j = i + 1; j < N; j++){
      let matchingCard = CalculateMatchingCard(boardState[i], boardState[j]);

      for(let k = j + 1; k < N; k++){
        if(AreCardsEqual(matchingCard, boardState[k]))
          return true;
      }
    }
  }
  return false;
}


export const SetupRound = ( game: SetGameState ) => {
  game.remainingCards = [];
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      for(let k = 0; k < 3; k++){
        for(let l = 0; l < 3; l++){
          game.remainingCards.push({color: i,
                               fill: j,
                               count: k,
                               shape: l,
                               isTaken: false});
        }
      }
    }
  }

  shuffle(game.remainingCards);
}

export const IncreaseScore = ( game: SetGameState, userId: string ) => {
  if(!game.scoreBoard.hasOwnProperty(userId)){
    game.scoreBoard[userId] = 1;
    return;
  }

  game.scoreBoard[userId]++;
}

const ResetGame = (game: SetGameState, resetGameCallBack: () => void) => {
  game.gameOn = false;
  game.remainingCards = [];
  game.boardState = [];
  resetGameCallBack();
}

export const StartGame = (game: SetGameState, startGameCallback: () => void,
                          dealCallback: (drawnCards: Card[]) => void) => {
  if(game.gameOn) return;
  const N = 3;
  const timeout = 1000;

  game.gameOn = true;
  SetupRound(game);
  startGameCallback();

  setTimeout(() => {
    DealCards(game, dealCallback);
  }, (N + 1) * timeout);
}

const boardInitialSize = 12;

export const DealCards = (game: SetGameState, dealCallback: (drawnCards: Card[]) => void) => {
  if(game.remainingCards.length === 0)
    return;

  let allDrawnCards: Card[] = [];
  let minDraw = 0;
  let setAvailable = false;
  do {
    let drawCount = game.boardState.length === 0 ? boardInitialSize : Math.max(minDraw, boardInitialSize - game.boardState.length);

    const drawnCards = game.remainingCards.splice(0, drawCount);
    game.boardState = game.boardState.concat(drawnCards);
    allDrawnCards = allDrawnCards.concat(drawnCards);

    // TODO: change to something else - not clean enough
    setAvailable = IsSetAvailable(game.boardState);
    if(!setAvailable) minDraw = 3;

  } while(game.remainingCards.length !== 0 && !setAvailable);

  console.log(allDrawnCards.length, setAvailable);

  dealCallback(allDrawnCards);
}

// assume idx is sorted
export const CheckBoardSet = (game: SetGameState, idx: number[]): boolean => {
  if(idx.length !== 3) return false;

  if(!isSortedNumArrUniq(idx))return false;

  let cardSet = idx.map(i => game.boardState[i]);
  return CheckSet(cardSet);
}

// assume idx is sorted
export const RemoveFromBoard = (game: SetGameState, idx: number[], timeout: number = 0,
                      takenCallback: (idx: number[]) => void,
                      removedCallback: (idx: number[]) => void) => {
  let idxToRemove: number[] = [];

  if( timeout > 0 ){
    let takenCount = 0;
    for(let i = 0; i < idx.length; i++){
      if(game.boardState[idx[i]].isTaken){
        takenCount++;
      } else {
        game.boardState[idx[i]].isTaken = true;
        idxToRemove.push(idx[i] - takenCount);
      }
    }

    takenCallback(idxToRemove);
  } else {
    idxToRemove = idxToRemove.concat(idx);
  }

  setTimeout(() => {
    game.boardState = game.boardState.filter((e: Card, i: number) => !(idxToRemove.includes(i)));
    removedCallback(idxToRemove);
  }, timeout);
}