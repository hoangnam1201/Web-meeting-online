import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ToolBar from './toolbar'
import Table1 from './tables/table1'
import Table2 from './tables/table2'
import Table3 from './tables/table3'
import Table5 from './tables/table5'
import Table6 from './tables/table6'
import Table7 from './tables/table7'
import Table8 from './tables/table8'
import Table4 from './tables/tables4'
import VideoTableContainer, { MyVideo } from './videoTableContainer'
import ChatBox from './chatBox'
import { ROOMTABLE_LOADING } from '../../store/reducers/roomTablesReducer'
import LinearProgress from '@mui/material/LinearProgress';
import { tableCallClear, tableSetPinStream } from '../../store/actions/tableCallAction'
import MicOffIcon from "@mui/icons-material/MicOff";
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import Avatar from 'react-avatar';
import { IconButton } from '@mui/material'

const RoomDetail = ({ connection }) => {
    const roomCall = useSelector(state => state.roomCall);
    const roomTables = useSelector(state => state.roomTables);


    return (
        <div className='min-h-screen relative bg-gray-100'>
            <VideoTableContainer className='sticky z-10 justify-center w-full overflow-x-auto top-4 croll-none' />
            <div className='text-xl font-semibold py-4 bg-gray-100 text-gray-500
            '>{connection?.current?.info?.name}</div>
            <div className='h-2'>
                {roomTables?.loading && <LinearProgress />}
            </div>
            <div className='px-4'>
                <ListTable tables={roomTables.items} connection={connection} />
            </div>
            <PinVideo />
            {roomCall?.showChat && <ChatBox connection={connection} className=' fixed h-96 w-80 transform -translate-y-full -translate-x-full z-40 top-full
            bg-white shadow-md' style={{ left: '98%' }} />}
            <div className='fixed z-30 top-full transform -translate-y-full flex justify-center w-full'>
                <ToolBar className='bg-white px-8 rounded-lg shadow-inner' connection={connection} />
            </div>
        </div>
    )
}

const PinVideo = () => {
    const videoRef = useRef(null)
    const tableCall = useSelector(state => state.tableCall);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!tableCall) return;
        const stream = tableCall?.pin?.stream;
        if (!stream) return;

        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;

    }, [tableCall])

    return (
        <>
            {tableCall?.pin && <div className='fixed z-20 rounded-md overflow-hidden top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-lg p-1 bg-gray-500'
                style={{ width: '800px', minHeight: '400px' }}>
                <div className='flex justify-between px-3 bg-gray-500 items-center border-b-2'>
                    <div className='flex gap-2 '>
                        <div className='text-shadow text-white'> {tableCall.pin.user.name} </div>
                        <div hidden={tableCall.pin.media.audio}>
                            <MicOffIcon className='text-red-500' />
                        </div>
                    </div>
                    <div>
                        <IconButton onClick={() => dispatch(tableSetPinStream(null))}>
                            <MinimizeIcon fontSize='small' className='text-white' />
                        </IconButton>
                    </div>
                </div>
                <video ref={videoRef} autoPlay className='h-full w-full' muted hidden={!tableCall.pin.media.video} />
                {!tableCall.pin.media.video && <Avatar
                    name={tableCall.pin.user.name}
                    round
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />}
            </div>}
        </>
    )
}

const ListTable = React.memo(({ tables, connection }) => {
    const dispatch = useDispatch()
    const myStream = useSelector(state => state.myStream);

    const joinTable = (id) => {
        dispatch({ type: ROOMTABLE_LOADING });
        connection.current.clearPeers();
        dispatch(tableCallClear());

        if (!myStream) return;
        const stream = myStream.stream;
        if (!stream) return;

        let media = { video: false, audio: false };
        stream.getTracks().forEach(track => {
            if (track.kind === 'audio' && track.readyState === 'live') {
                media = { ...media, audio: true };
            }
            if (track.kind === 'video' && track.readyState === 'live') {
                media = { ...media, video: true };
            }
        })

        connection.current.socket.emit('table:join', id, connection.current.myID, media);
    }
    console.log('render')
    return (
        <>
            <div className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 relative z-0'>
                {tables?.map(t => {
                    switch (t.numberOfSeat) {
                        case 1:
                            return <Table1 key={t._id} className='h-full overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 2:
                            return <Table2 key={t._id} className='h-full overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 3:
                            return <Table3 key={t._id} className='h-full overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 4:
                            return <Table4 key={t._id} className='h-full overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 5:
                            return <Table5 key={t._id} className='h-full col-span-2 overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 6:
                            return <Table6 key={t._id} className='h-full col-span-2 overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        case 7:
                            return <Table7 key={t._id} className='h-full col-span-2 overflow-hidden shadow' data={t} onClick={() => joinTable(t._id)} />
                        default:
                            return <Table8 key={t._id} className='h-full col-span-2 overflow-hidden shadoq' data={t} onClick={() => joinTable(t._id)} />
                    }
                })}
            </div>
        </>
    )
})

export default RoomDetail
