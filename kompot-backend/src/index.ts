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
import { GetRoomsByGameId, AddNewSetRoom, GetRoomByRoomId, GetSessionDataById, 
          GetUserById, RemoveSessionDataById, 
          IncrementSocketCountForPlayer, DecrementSocketCountForPlayer, AddNewSession, AddNewGuestUser} from './db';
import { SetupRound, StartGame, CheckBoardSet, RemoveFromBoard, DealCards, IncreaseScore } from './Set/actions';
import { SocketData } from './types';
import { randomId } from './api/api';
import { disconnect } from 'process';

app.get('/', function (req: any, res: any) {
  res.send('Hello World');
});

const games: GameData[] = [];

const dealCardsToRoom = ( roomId: string, cards: Card[] ) => {
  io.to(roomId).emit('dealCards', cards);
}

io.use((socket: any, next: any) => {
  const expirationDateDays = 2;

  const sessionId = socket.handshake.auth.sessionId;

  if( sessionId ){
    const sessionData = GetSessionDataById(sessionId);
    const userData = sessionData !== null ? GetUserById(sessionData.userId) : null;

    if(userData !== null){
      socket.sessionId = sessionId;
      socket.userId = userData.id;
      return next();
    } else if(sessionData !== null){
      RemoveSessionDataById(sessionId);
      return next(new Error("invalid sessionId"));
    }
  }



  // add new guest User
  socket.userId = AddNewGuestUser();

  // Setup session data
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDateDays);
  socket.expirationDate = expirationDate;

  socket.sessionId = AddNewSession(socket.userId, socket.expirationDate);
  next();
});

io.on('connection', (socket: any) => {
  console.log('new connection');

  // setup local socket connection data
  socket.connectionData = {
    joinedRooms: [],
  }

  socket.emit('session', {
    sessionId: socket.sessionId, 
    userId: socket.userId,
    expirationDate: socket.expirationDate
  });

  socket.on('add-new-room', () => {
    AddNewSetRoom();
  });


  socket.on('join-room', (roomId: string) => {
    if(socket.userId !== undefined){
      // TODO, test max room, password(if ever added) etc

      const room = GetRoomByRoomId(roomId);

      if(room !== null){
        socket.join(roomId);
        //replace with socket.rooms?
        socket.connectionData.joinedRooms.push(roomId);
        IncrementSocketCountForPlayer(roomId, socket.userId);
        socket.emit('getGameRoomRes', room);
        return;
      } 
    }
    socket.emit('getGameRoomRes', null);
  });

  socket.on('leave-room', (roomId: string) => {
    if(socket.userId === undefined) return;
    //owner

    socket.leave(roomId);

    //replace with socket.rooms?
    socket.connectionData.joinedRooms = socket.connectionData.joinedRooms.filter((idx: string) => !(idx === roomId));
    DecrementSocketCountForPlayer(roomId, socket.userId);

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
    if(!socket.connectionData.joinedRooms.includes(roomId)) return;
    //check if socket is reeally in room
    console.log(set);
    const room = GetRoomByRoomId(roomId);
    if(room !== null && CheckBoardSet(room.gameState, set)) {
      IncreaseScore(room.gameState, socket.userId);

      io.to(roomId).emit('score-update', {
        [socket.userId]: room.gameState.scoreBoard,
      });

      console.log(room.gameState.scoreBoard);

      RemoveFromBoard(room.gameState, set, 1000, (idx: number[]) => {
        io.to(roomId).emit('taken-cards', idx);
      }, (idx: number[]) => {
        io.to(roomId).emit('removed-cards', idx);
        DealCards(room.gameState, (cards: Card[]) => {
                            dealCardsToRoom(room.id, cards);
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

  socket.on('disconnect', () => {
    console.log('disconnect');
    for(let i = 0; i < socket.connectionData.joinedRooms.length; i++){
      DecrementSocketCountForPlayer(socket.connectionData.joinedRooms[i], socket.userId);
    }
  });

});


console.log(`Server running at :${port}`);
server.listen(port);
