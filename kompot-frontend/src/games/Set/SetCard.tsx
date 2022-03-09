import React from 'react';
import { Card } from '@common/Set/types';
import './SetCard.scss';
import { Oval, Rhombus, Squiggle } from 'games/Set/BaseSymbols/BaseSymbols'

interface SetCardProps {
  card: Card;
  isSelected: boolean;
  isLandScape: boolean;
  onClick: any;
  idx: number;
}

interface CardSymbolProps {
  color: number;
  fill: number;
  shape: number;
}

const CardSymbol: React.FC<CardSymbolProps> = ( props ) => {
  const getColor = (color: number) => {
    switch(color){
      case 0:
        return 'red';
      case 1:
        return 'green';
      case 2:
        return 'purple';
      default:
        return 'black';
    }
  }

  const getShape = (shape: number, fill:string, color:string) => {
    switch(shape){
      case 0:
        return <Rhombus fill={fill} color={color} />;
      case 1:
        return <Oval fill={fill} color={color}/>;
      case 2:
        return <Squiggle  fill={fill} color={color}/>;
      default:
        return <></>;
    }
  }

  const getHatch = (color: string) => (
    <defs>
        <pattern id={`hatch-${color}`} width={5} height={3} patternUnits="userSpaceOnUse">
          <line stroke={color} x1="0" y1="0" x2="0" y2="10" strokeWidth="2"/>
        </pattern>
    </defs>
  )

  const getFill = (fill: number, color: string) => {
    switch(fill){
      case 0:
      default:
        return 'none';
      case 1:
        return `url(#hatch-${color})`;
      case 2:
        return color;
    }
  }


  const color = getColor(props.color);
  const fill = getFill(props.fill, color);
  const shape = getShape(props.shape, fill, color);

  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        height={78}
        width={183}
      >
      //awful fix but its working
      {getHatch(color)}
      {shape}
  </svg>
  );
}

export const SetCard: React.FC<SetCardProps> = ( props ) => {
  const { card, isLandScape, isSelected } = props;

  const getCardSymbols = (count:number, color:number, fill:number, shape:number) => {
    return [...Array(count + 1)].map((_, i) =>
      <CardSymbol key={`cardSymbol-${i}`} color={color} fill={fill} shape={shape}/>);
  }

  const getClassName = (card: Card, isSelected: boolean, isLandScape: boolean) =>
  `setCard${isSelected ? ' selectedCard' : ''}${isLandScape ? ' landscape' : ''} ${card.isTaken ? 'taken' : ''}`

  return(<div onClick={props.onClick} className={getClassName(card, isSelected, isLandScape)}>
          {getCardSymbols(card.count, card.color, card.fill, card.shape)}
        </div>);
}
