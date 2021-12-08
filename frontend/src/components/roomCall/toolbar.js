import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import ChatIcon from "@mui/icons-material/Chat";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOff from '@mui/icons-material/VideocamOff';
import MicIcon from "@mui/icons-material/Mic";
import Connection from '../../services/connection';
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import { useDispatch, useSelector } from 'react-redux';
import { roomShowChatAction } from '../../store/actions/roomCallAction';
import { MYSTREAM_SET } from '../../store/reducers/myStreamReducer';


const Toolbar = ({ connection, ...rest }) => {
    const roomCall = useSelector(state => state.roomCall);
    const myStream = useSelector(state => state.myStream);
    const [media, setMedia] = useState({ audio: false, video: false });
    const dispatch = useDispatch();

    const turnOffAudio = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'audio');
            track?.stop();
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    const turnOnAudio = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'audio');
            if (track) {
                track?.stop();
                myStream.stream.removeTrack(track)
            }
            const streamTemp = await Connection.getVideoAudioStream(false, true, 12);
            myStream.stream.addTrack(streamTemp.getTracks()[0]);
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    const turnOffVideo = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'video');
            track.stop();
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
            connection.socket.emit('table:change-media')
        } catch (err) {
            console.log(err)
        }
    }

    const turnOnVideo = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'video');
            if (track) {
                track?.stop();
                myStream.stream.removeTrack(track)
            }
            const streamTemp = await Connection.getVideoAudioStream(true, false, 12);
            myStream.stream.addTrack(streamTemp.getTracks()[0]);
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
            connection.socket.emit('table:change-media')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!myStream.stream) return;
        let temp = {}
        myStream.stream.getTracks().forEach(track => {
            if (track.kind === 'audio' && track.readyState === 'live') {
                temp = { ...temp, audio: true };
            }
            if (track.kind === 'video' && track.readyState === 'live') {
                temp = { ...temp, video: true };
            }
        })
        setMedia(temp)
        connection.replaceStream();
    }, [myStream])

    return (
        <div {...rest}>
            <div className='flex gap-8 py-2 text-gray-500'>
                {media.audio ?
                    <IconButton onClick={turnOffAudio}>
                        <MicIcon fontSize='large' />
                    </IconButton> :
                    <IconButton onClick={turnOnAudio}>
                        <MicOffIcon fontSize='large' />
                    </IconButton>
                }
                {media.video ?
                    <IconButton onClick={turnOffVideo}>
                        <PhotoCameraFrontIcon fontSize='large' />
                    </IconButton> :
                    <IconButton onClick={turnOnVideo}>
                        <VideocamOff fontSize='large' />
                    </IconButton>
                }
                <IconButton>
                    <ScreenShareIcon fontSize='large' />
                </IconButton>
                <IconButton onClick={() => {
                    if (roomCall)
                        dispatch(roomShowChatAction(!roomCall.showChat))
                }}>
                    <ChatIcon fontSize='large' />
                </IconButton>
            </div>
        </div>
    )
}

export default Toolbar
