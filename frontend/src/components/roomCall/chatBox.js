import React, { useEffect, useRef, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { roomShowChatAction } from '../../store/actions/roomCallAction';
import { Waypoint } from 'react-waypoint';
import LinearProgress from '@mui/material/LinearProgress';
import { ROOMMESSAGES_LOADING } from '../../store/reducers/roomMessagesReducer';
import { TABLEMESSAGES_LOADING } from '../../store/reducers/tableMessagesReducer';

const ChatBox = ({ connection, ...rest }) => {
    const [value, setValue] = useState(0)
    const [msgText, setMsgText] = useState('');
    const dispatch = useDispatch();
    const roomMessages = useSelector(state => state.roomMessages);
    const tableMessages = useSelector(state => state.tableMessages);
    const currentUser = useSelector((state) => state.userReducer);
    const endRef = useRef(null);

    const handleChange = (e, newValue) => {
        console.log(newValue)
        setValue(newValue)
    }

    useEffect(() => {
        endRef.current.scrollIntoView();
    }, [value])

    const handleKeydown = (e) => {
        if (e.key === 'Enter') {
            if (value == 0) {
                connection.socket.emit('table:send-message', msgText);
                dispatch({ type: TABLEMESSAGES_LOADING })
            }
            if (value == 1) {
                connection.socket.emit('room:send-message', msgText);
                dispatch({ type: ROOMMESSAGES_LOADING })
            }
            setMsgText('');
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div {...rest}>
            <div className='shadow-md flex justify-between'>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label='Table' />
                    <Tab label='Room' />
                </Tabs>
                <Button onClick={() => dispatch(roomShowChatAction(false))}>X</Button>
            </div>
            <div className='h-3/4 overflow-auto'>
                <div hidden={value != 0}>
                    {tableMessages?.items.map((m, index) => <Message msgData={m} key={index}
                        type={currentUser.user._id === m.sender._id ? 0 : 1} />)}
                </div>
                <div hidden={value != 1}>
                    <div className='flex flex-col-reverse'>
                        {roomMessages.items?.map((m, index) => <Message msgData={m} key={index}
                            type={currentUser.user._id === m.sender._id ? 0 : 1} />)}
                        <Waypoint onEnter={() => console.log('enter')} />
                    </div>
                </div>
                <div ref={endRef} />
            </div>
            <div className='h-2'>
                <div hidden={!roomMessages?.loading && !tableMessages?.loading}>
                    <LinearProgress />
                </div>
            </div>
            <input className='px-5 py-2 w-full shadow-md focus:outline-none bg-gray-100 rounded-full'
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                onKeyDown={handleKeydown} />
        </div>
    )
}

const Message = ({ msgData, type, ...rest }) => {
    return (
        <div {...rest}>
            <div className={`flex flex-col ${type === 0 ? 'items-end' : 'items-start'} mt-4 mx-2 `}>
                {type === 1 && <div className='text-sm mx-4'>{msgData.sender?.name}</div>}
                <div className={`w-3/4 h-auto ${type === 0 ? 'bg-blue-200' : 'bg-gray-200'} rounded-lg px-2 py-1
                 whitespace-normal break-words`}>{msgData.message}</div>
            </div>
        </div>
    )
}

export default React.memo(ChatBox)
