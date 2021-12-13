import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Connection from '../../services/connection';
import CheckMedia from './checkMedia'
import RoomDetail from './roomDetail';

const RoomCall = () => {
    const roomCall = useSelector(state => state.roomCall);
    const connection = useRef(null)

    useEffect(() => {
        connection.current = new Connection();
        return () => {
            connection.current.destructor();
            window.location.reload();
        }
    }, [])

    return (
        <div>
            {!roomCall.accessMedia ?
                <CheckMedia connection={connection} /> :
                <RoomDetail connection={connection} />}
        </div>
    )
}

export default RoomCall
