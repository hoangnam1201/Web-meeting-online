import { IconButton, Tab, Tabs } from '@mui/material'
import React, { useRef, useState } from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useDispatch } from 'react-redux';
import { roomShowChatAction } from '../../../store/actions/roomCallAction';
import { Message } from '../chatBox';
import { Waypoint } from "react-waypoint";
import { useSelector } from 'react-redux';

const ChatBox = ({ connection, roomMessages }) => {
    const [tab, setTab] = useState(0);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.userReducer);
    const [msgText, setMsgText] = useState("");

    const handleKeydown = (e) => {
        console.log(typeof e);
        if (e.key === "Enter") {
            setMsgText("");
            connection.current.socket.emit("room:send-message", msgText);
        }
    };

    return (
        <div className='overflow-auto h-full flex flex-col'>
            <div className='flex justify-between' style={{ flexBasis: 0 }}>
                <Tabs value={tab} onChange={(e, tabValue) => setTab(tabValue)}>
                    <Tab label='Chat'
                        style={{ color: 'white' }}
                        className='text-white' />
                    <Tab label='Participabts'
                        style={{ color: 'white' }}
                        className='text-white' />
                </Tabs>
                <IconButton onClick={() => dispatch(roomShowChatAction(false))}>
                    <ArrowRightAltIcon fontSize='large' style={{ color: 'white' }} />
                </IconButton>
            </div>
            {tab === 0 && <div className='flex-grow h-0 flex flex-col'>
                <div className='flex-grow h-0 py-4'>
                    <div className='overflow-auto scroll-sm h-full flex flex-col-reverse'>
                        <div className="flex flex-col-reverse">
                            {roomMessages?.map((m, index) => (
                                <Message
                                    msgData={m}
                                    nameClass={'text-white'}
                                    key={index}
                                    type={currentUser.user._id === m.sender._id ? 0 : 1}
                                />
                            ))}
                            <Waypoint onEnter={() => console.log("enter")} />
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center bg-gray-600 py-4'>
                    <input
                        className="mx-4 px-5 py-2 w-full shadow-md focus:outline-none bg-gray-100 rounded-xl"
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        onKeyDown={handleKeydown}
                    />
                </div>
            </div>}
            {tab === 1 && <div className='flex-grow h-0 flex flex-col'>

            </div>}
        </div>
    )
}
export default ChatBox
