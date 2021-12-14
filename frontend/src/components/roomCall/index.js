import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Connection from '../../services/connection';
import CheckMedia from './checkMedia'
import RoomDetail from './roomDetail';

const RoomCall = () => {
    const roomCall = useSelector(state => state.roomCall);
    const connection = useRef(null);
    const [roomMessages, setRoomMessage] = useState([]);
    const [tableMessages, setTableMessage] = useState([]);
    const [streamDatas, setStreamDatas] = useState({});
    const [myStream, setMyStream] = useState({ stream: null });
    const [canAccess, setCanAccess] = useState(false);
    const [access, setAccess] = useState(false);
    const [roomTables, setRoomTables] = useState([]);

    useEffect(() => {
        connection.current = new Connection({ updateInstance });
        connection.current.initMyStream();
        return () => {
            connection.current.destoryDisconnect();
        }
    }, [])

    const updateInstance = (key, data) => {
        switch (key) {
            case 'room:messages':
                return setRoomMessage(data);
            case 'table:messages':
                return setTableMessage(data);
            case 'table:streamDatas':
                return setStreamDatas(data);
            case 'myStream':
                return setMyStream(data);
            case 'canAccess':
                return setCanAccess(data);
            case 'access':
                return setAccess(data);
            case 'tables':
                return setRoomTables(data);
            default:
                return;
        }
    }


    return (
        <div>
            {!access ?
                <CheckMedia
                    connection={connection}
                    canAccess={canAccess}
                    myStream={myStream} /> :
                <RoomDetail connection={connection}
                    streamDatas={streamDatas}
                    roomMessages={roomMessages}
                    myStream={myStream}
                    roomTables={roomTables}
                    tableMessages={tableMessages} />}
        </div>
    )
}

export default RoomCall
