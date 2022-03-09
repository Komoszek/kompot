import React from 'react';
import GameTile from 'components/GameTile';
import { GAME_MODES } from 'data/GameModes';
import './ChooseLobby.scss';

const ChooseLobby: React.FC = () => {
  return(
    <div className="chooseLobbyList">
      {GAME_MODES.map(
        (game, i) => <GameTile key={`${game.id}-${i}`} game={game}/>
      )}
    </div>)
}

export default ChooseLobby;
