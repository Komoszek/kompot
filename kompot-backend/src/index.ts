const app = require('express')();
const port = 3001;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

import { GameData } from '@common/types';
import { Card } from '@common/Set/types';
import { GetRoomsByGameId, GetAllRooms, GetRoomByRoomId } from './db';
import { SetupRound, StartGame, CheckBoardSet, RemoveFromBoard, DealCards } from './Set/actions';

app.get('/', function (req: any, res: any) {
  res.send('Hello World');
});

const games: GameData[] = [];

const dealCardsToRoom = ( roomId: string, cards: Card[] ) => {
  io.to(roomId).emit('dealCards', cards);
}

io.on('connection', (socket: any) => {
  console.log('new connection');

  socket.on('join-room', (roomId: string) => {
    // TODO, test max room size and other things
    socket.join(roomId);
    const room = GetRoomByRoomId(roomId);
    socket.emit('getGameRoomRes', room);
  });

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on('getRooms', ( gameId: string ) => {
    console.log('getting rooms');
    const rooms = GetRoomsByGameId(gameId);
    socket.emit('getRoomsRes', rooms);
  });

  socket.on('getGameRoom', ( roomId: string ) => {
    console.log('getting room');
    const room = GetRoomByRoomId(roomId);
    socket.emit('getGameRoomRes', room);
  });

  socket.on('set-taken', (roomId: string, set: number[]) => {
    //check if socket is reeally in room
    console.log(set);
    const room = GetRoomByRoomId(roomId);
    if(room !== null && CheckBoardSet(room.gameState, set)) {
      RemoveFromBoard(room.gameState, set, 1000, (idx: number[]) => {
        io.to(roomId).emit('taken-cards', idx);
      }, (idx: number[]) => {
        io.to(roomId).emit('removed-cards', idx);
        DealCards(room.gameState, (cards: Card[]) => {
                            dealCardsToRoom(room.id, cards)
                          });
      });
      /*
      (game: SetGameState, idx: number[], timeout: number = 0,
                            takenCallback: (idx: number[]) => void,
                            removedCallback: (idx: number[]) => void)
      */
    }

  });

  socket.on('startGame', ( roomId: string) => {
    const room = GetRoomByRoomId(roomId);

    if(room != null){
      StartGame(room.gameState, () => {
        io.to(room.id).emit('gameOn-state', true);
      }, (cards: Card[]) => {
                          dealCardsToRoom(room.id, cards)
                        });
      console.log('game start');
    }

  });
});

//
const rooms = GetAllRooms();

for(let i = 0; i < rooms.length; i++){
  SetupRound(rooms[i].gameState);
}

console.log(`Server running at :${port}`);
server.listen(port);
