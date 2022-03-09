import React, { useState, useEffect, useContext } from 'react';
import { SetGameState, Card } from '@common/Set/types';
import { SetCard } from './SetCard';
import { SocketContext } from 'SocketContext';
import './SetGame.scss';
interface SetGameProps {
  gameState: SetGameState;
  roomId: string;
}

export const SetGame: React.FC<SetGameProps> = (props) => {
  const socket = useContext(SocketContext);
  const { gameState, roomId } = props;
  const [gameOn, setGameOn] = useState<boolean>(gameState.gameOn);
  const [boardState, setBoardState] = useState<Card[]>(gameState.boardState);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);

  const sendSetForCheck = (set: number[]) => {
    console.log(set);
    socket.emit('set-taken', roomId, set);
  }

  const addAndSort = (arr: number[], el: number) => {
    return [...arr, el].sort((a, b) => a - b);
  }

  const toggleCard = (id: number) => {
    const setSize = 3;

    if(selectedCards.includes(id)){
      setSelectedCards(prev => prev.filter(idx => idx !== id));
      return;
    }

    if(selectedCards.length >= setSize - 1){
      sendSetForCheck(addAndSort(selectedCards, id));

      setSelectedCards([]);
      return;
    }

    setSelectedCards(prev => addAndSort(prev, id));
  }

  const startGame = () => {
    socket.emit('startGame', roomId);
  }

  useEffect(() => {
    console.log(selectedCards);
  }, [selectedCards])

  useEffect(() => {
    socket.on('dealCards', (res: Card[]) => {
      setBoardState(old => [...old, ...res]);
    });

    socket.on('gameOn-state', (res: boolean) => {
      setGameOn(res);
    });

    socket.on('taken-cards', (res: number[]) => {
      console.log('taken', res);
      setBoardState(prev => {
        const newArr = [...prev];
        for(let i = 0; i < res.length; i++){
          newArr[res[i]].isTaken = true;
        }

        return [...newArr];
      });
    });

    socket.on('removed-cards', (res: number[]) => {
      setBoardState(prev => prev.filter((e, i) => !res.includes(i)));


      setSelectedCards(prev => {
        const newArr = [];

        let idx = 0;

        for(let i = 0; i < prev.length; i++){
          while(res[idx] < prev[i]) idx++;
          if(res[idx] != prev[i]) newArr.push(prev[i] - idx);
        }

        return [...newArr];
      });
    });



    return(() => {
      socket.off('dealCards');
      socket.off('gameOn-state');
      socket.off('taken-cards');
      socket.off('removed-cards');
    });
  },[]);


  return (<div className="setBoard">
          {gameOn ? <></> : <button onClick={startGame}>Start Game</button>}

          {boardState.map((e, i) =>
            <SetCard key={`${e.color}${e.fill}${e.count}${e.shape}`} isLandScape={false} isSelected={selectedCards.includes(i)} idx={i} onClick={() => toggleCard(i)} card={e} />
          )}
          </div>);
}
