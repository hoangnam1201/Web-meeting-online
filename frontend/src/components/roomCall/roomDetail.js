import React, { useEffect } from 'react'
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
import VideoTableContainer from './videoTableContainer'
import ChatBox from './chatBox'
import { ROOMTABLE_LOADING } from '../../store/reducers/roomTablesReducer'
import LinearProgress from '@mui/material/LinearProgress';
import { tableCallClear } from '../../store/actions/tableCallAction'

const RoomDetail = ({ connection }) => {
    const roomCall = useSelector(state => state.roomCall);
    const roomTables = useSelector(state => state.roomTables);


    return (
        <div className='min-h-screen relative bg-gray-100'>
            <VideoTableContainer className='sticky z-10 justify-center w-full overflow-x-auto top-4 croll-none' />
            <div className='text-xl font-semibold py-4 bg-gray-100 text-gray-500
            '>{connection?.info?.name}</div>
            <div className='h-2'>
                {roomTables?.loading && <LinearProgress />}
            </div>
            <ListTable tables={roomTables.items} connection={connection} />
            {roomCall?.showChat && <ChatBox connection={connection} className=' fixed h-96 w-80 transform -translate-y-full -translate-x-full z-20 top-full
            bg-white shadow-md' style={{ left: '98%' }} />}
            <div className='fixed top-full transform -translate-y-full z-10 flex justify-center w-full'>
                <ToolBar className='bg-white px-8 rounded-lg shadow-inner' connection={connection} />
            </div>
        </div>
    )
}

const ListTable = React.memo(({ tables, connection }) => {
    const dispatch = useDispatch()

    const joinTable = (id) => {
        dispatch({ type: ROOMTABLE_LOADING });
        connection.clearPeers();
        dispatch(tableCallClear());
        connection.socket.emit('table:join', id, connection.myID);
    }
    console.log('render')
    return (
        <>
            <div className='grid grid-cols-3 md:gird-cols-5 lg:grid-cols-6 gap-2 relative z-0'>
                {tables?.map(t => {
                    switch (t.numberOfSeat) {
                        case 1:
                            return <Table1 key={t._id} className='h-full overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 2:
                            return <Table2 key={t._id} className='h-full overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 3:
                            return <Table3 key={t._id} className='h-full overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 4:
                            return <Table4 key={t._id} className='h-full overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 5:
                            return <Table5 key={t._id} className='h-full col-span-2 overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 6:
                            return <Table6 key={t._id} className='h-full col-span-2 overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        case 7:
                            return <Table7 key={t._id} className='h-full col-span-2 overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                        default:
                            return <Table8 key={t._id} className='h-full col-span-2 overflow-hidden' data={t} onClick={() => joinTable(t._id)} />
                    }
                })}
            </div>
        </>
    )
})

export default RoomDetail
