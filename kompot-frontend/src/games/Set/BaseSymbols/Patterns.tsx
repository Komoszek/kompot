import React from 'react';

interface HatchProps {
    id: string | undefined;
    color: string;
}

export const Hatch: React.FC<HatchProps> = ( props ) => (
    <defs>
        <pattern id={props.id} width={5} height={3} patternUnits="userSpaceOnUse">
          <line stroke={props.color} x1="0" y1="0" x2="0" y2="10" strokeWidth="2"/>
        </pattern>
    </defs>
  );