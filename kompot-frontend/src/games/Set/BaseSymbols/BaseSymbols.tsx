import React from 'react';

export const Oval = (props: any) => (
    <rect x={4} y={4} width={175} height={70} rx={35} style={{
      stroke: props.color,
      fill: props.fill,
      strokeWidth: 4,
      strokeLinejoin: 'round',
    }} />
)

export const Squiggle = (props: any) => (
  <path
      id="a"
      d="M6 36c6-13 11-23 26-28s31-1 58 7c23 7 36 0 43-3 7-4 17-9 30-9s18 21 12 33c-5 11-14 23-26 28s-32 1-59-7c-17-5-29-3-42 3-9 4-18 10-30 9C5 69-1 51 6 36z"
      style={{
        stroke: props.color,
        fill: props.fill,
        strokeWidth: 4,
        strokeLinejoin: 'round'
      }}
    />
)

export const Rhombus = (props: any) => (
  <path d="M4 39 91 4l88 35-88 35z" style={{
    stroke: props.color,
    fill: props.fill,
    strokeWidth: 4,
    strokeLinejoin: 'round'
  }}/>
)
