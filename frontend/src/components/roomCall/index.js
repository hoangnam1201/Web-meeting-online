import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Connection from '../../services/connection';
import CheckMedia from './checkMedia'
import RoomDetail from './roomDetail';

const RoomCall = () => {
    const roomCall = useSelector(state => state.roomCall);
    const [connection, setConnection] = useState();

    useEffect(() => {
        setConnection(new Connection());
        return () => {
            setConnection(cn => {
                cn?.destructor();
                return null;
            })
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
