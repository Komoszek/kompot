import React from 'react';
import { Link } from 'react-router-dom';
import './GameTile.scss';
import { GameData } from '@common/types';

interface GameTileProps {
  game: GameData
}

const GameTile: React.FC<GameTileProps> = ( props ) => {
  const game = props.game;
  return(<Link to={`./${game.id}`}>
          <div className="gameTile card">
            <img src={game.icon} alt={`Icon of ${game.name}`}/>
            <p>{game.name}</p>
          </div>
        </Link>);
}

export default GameTile;
