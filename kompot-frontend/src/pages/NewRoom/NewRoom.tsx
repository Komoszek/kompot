import React, { useContext } from 'react';
import { SocketContext } from 'SocketContext';
import { useNavigate } from 'react-router-dom';

const NewRoom = () => {
    const navigate = useNavigate();

    const socket = useContext(SocketContext);
    const AddNewRoom = () => {

        socket.emit('add-new-room');
        navigate('/lobby');

    }
    return(<button onClick={() => AddNewRoom()}>Add new room</button>)
}

export default NewRoom;