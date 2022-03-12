import { createContext } from 'react';
import { io } from 'socket.io-client';

import Cookies from 'js-cookie';

export const socket = io('http://localhost:3001',{
    auth: {
        sessionId: Cookies.get('sessionId'),
    }
});

socket.on('session', ({sessionId, userId, expirationDate}) => {
    console.log(sessionId, userId, expirationDate);
    Cookies.set('sessionId', sessionId, { expires: new Date(expirationDate) });
    Cookies.set('userId', userId, { expires: new Date(expirationDate) });
});

export const SocketContext = createContext(socket);
