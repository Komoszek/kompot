import { Card } from './types'

export const dupa = () => {
  console.log('dupaa');
}
// Assume standard rules
const AllCardsTaken = ( set: Card[] ): boolean => {
  for(let i = 0; i < set.length; i++){
    if(set[i].isTaken === false){
      return false;
    }
  }

  return true;
}

export const CheckSet = ( cardSet: Card[] ): boolean => {
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
